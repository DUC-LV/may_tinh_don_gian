*********************************************************************************** [slugVideo]
/* eslint-disable max-len */
import { RecommendVodSection, SectionType, TabSection, ContentType } from '@ott/api/dist/api-client/schemas';
import { PUBLIC_ENV } from '@ott/api/dist/env';
import { getServerSidePropsFunc } from '@ott/api/dist/next-server-props';
import { useFetchMore } from '@ott/hooks/dist/fetch-more';
import { ListSpinner, NoData, ScrollSelection } from 'components';
import { SwiperCarouselDynamic } from 'components/dynamic';
import { ResponsiveContainer, Section, VideoSlider } from 'containers';
import { InferGetServerSidePropsType } from 'next';
import { SSRConfig, WithTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box } from 'theme-ui';
import { serverClient } from '../../../server/server-client';
import { browserClient } from '../../browser-client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LOCAL_STORAGE_KEY, REFER_PAGES } from '@ott/common/dist/constants';
import { KPI_LOG_PARAMS } from '@ott/common/dist/kpi-params';
import { saveKpiLog, saveUserActionUtmSource } from '../../kpi-browser-client';
import { VodLoading } from 'containers/Loading/Home';
import useWindowSize from 'hooks/useWindowResize';
import uniqBy from 'lodash/uniqBy';

const GET_LIST_CATEGORY_LIMIT = 10;

export const getServerSideProps = getServerSidePropsFunc(serverClient, async ({ client, query, locale }) => {
    return {
        ...((await serverSideTranslations(locale, ['common'])) as SSRConfig),
        data: (await client.getHomeVod(query?.c as string, 0, GET_LIST_CATEGORY_LIMIT)).data.data,
        catData: query?.c
            ? (await client.getListCategory(String(query.c), 0, GET_LIST_CATEGORY_LIMIT)).data.data
            : null,
    };
});

const RecommendVods = ({
    onClickSection,
    defaultData,
    onClickItem,
}: {
    onClickSection: (sectionId: string) => void;
    defaultData?: RecommendVodSection;
    onClickItem?: (item: { id: number | string }, sectionId: string | number) => void;
}) => {
    const [section, setData] = useState<RecommendVodSection | null | undefined>(defaultData);
    const hasDefaultData = defaultData && defaultData.content && defaultData.content.length > 0;
    const [loading, setLoading] = useState(!hasDefaultData);
    useEffect(() => {
        if (!hasDefaultData) {
            setLoading(true);
            browserClient
                .getRecommendedVods('vod', undefined, undefined, defaultData?.id)
                .then(res => setData(res.data?.data))
                .finally(() => setLoading(false));
        }
    }, [defaultData?.id, hasDefaultData]);

    const { width } = useWindowSize();
    if (loading) {
        const w = Number(width);
        let h;
        if (w >= 1200) {
            h = 224.631;
        } else if (w >= 992) {
            h = 181.634;
        } else {
            h = 160.625;
        }
        return (
            <Box
                sx={{
                    height: h,
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                <VodLoading />
            </Box>
        );
    }

    if (!section?.content || section.content.length === 0) {
        return null;
    }
    return (
        <Section
            key={section.id}
            onClick={() => onClickSection(`${section?.id}`)}
            name={section.name}
            itemLength={section.content?.length}
            link={{ href: `/recommend/videos?page=vod&id=${section.id}` }}>
            <VideoSlider
                items={section.content ?? []}
                oneLine
                type={section.itemType}
                refer={{
                    col: String(section.id),
                    sect: section.type,
                    page: REFER_PAGES.HOME_VIDEOS,
                }}
                onClickItem={item => {
                    onClickItem?.({ id: item.id }, section.id);
                }}
            />
        </Section>
    );
};

const VideoCategoriesPage = ({
    data: firstPage,
    catData,
}: WithTranslation & InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [catId, setCatId] = useState(router.query.c ? Number(router.query.c) : 0);
    const fetchMoreCallBack = useCallback((startTime: number, finishTime: number) => {
        const data = {
            ...KPI_LOG_PARAMS.MOVIE.LOAD_MORE,
            actionStart: startTime,
            actionFinish: finishTime,
        };
        saveKpiLog(LOCAL_STORAGE_KEY.KPI.USER_ACTION, data);
    }, []);
    const { data, fetchMore, hasMore, loading } = useFetchMore(
        !catId ? firstPage : catData,
        GET_LIST_CATEGORY_LIMIT,
        async (offset, limit) => (await browserClient.getListCategory(catId, offset, limit)).data.data ?? [],
        undefined,
        fetchMoreCallBack
    );
    console.log(data);
    useEffect(() => {
        // save kpi log
        if (PUBLIC_ENV().LOG_KPI_ENABLED != '1') return;
        const now = new Date().getTime();
        const data = {
            ...KPI_LOG_PARAMS.VIDEO.INIT,
            actionStart: now,
            actionFinish: now,
        };
        saveKpiLog(LOCAL_STORAGE_KEY.KPI.USER_ACTION, data);
    }, []);
    const pushRoute = React.useCallback(
        (id: number, slug?: string) => {
            router.push(`/videos/[catSlug]?c=${id}`, `/videos/${slug || id}?c=${id}`);
        },
        [router]
    );
    const getTabName = React.useCallback(() => {
        const tabs = (firstPage ?? []).find(x => x.type === SectionType.TAB);
        return tabs?.type === 'TAB' ? (tabs?.content || []).find(x => x.id === catId)?.name : '';
    }, [catId, firstPage]);
    const bannerSection = firstPage?.find(item => item.type === SectionType.BANNER);
    const tabsSection = firstPage?.find(item => item.type === SectionType.TAB) as TabSection;
    const selectTab = async (id: number) => {
        pushRoute(id, tabsSection?.content?.find(i => i.id === id)?.slug);
        setCatId(id);
    };
    React.useEffect(() => {
        if (!/videos/.test(router.asPath)) {
            return;
        }
        if (!router.query.c && tabsSection?.content?.length) {
            router.replace(
                `/videos/[catSlug]?c=${tabsSection.content[0].id}`,
                `/videos/${tabsSection.content[0].slug || tabsSection.content[0].id}?c=${tabsSection.content[0].id}`,
                { shallow: true }
            );
        } else {
            setCatId(Number(router.query.c));
        }
    }, [router, tabsSection?.content]);
    const onClickSection = useCallback((sectionId: string) => {
        const data = {
            ...KPI_LOG_PARAMS.VIDEO.SECTION_DETAIL,
            actionStart: new Date().getTime(),
            actionFinish: 0,
            params: {
                section: sectionId,
            },
        };
        saveUserActionUtmSource(data);
    }, []);
    const tabName = getTabName();
    const onClickPlayVod = useCallback((item: { id: number | string }, sectionId: string | number) => {
        const data = {
            ...KPI_LOG_PARAMS.VIDEO.SECTION_PLAY_VIDEO,
            actionStart: new Date().getTime(),
            actionFinish: 0,
            params: {
                section: String(sectionId),
                // eslint-disable-next-line @typescript-eslint/camelcase
                video_id: String(item.id),
            },
        };
        saveUserActionUtmSource(data);
    }, []);
    const dataWhenfilter = uniqBy(data, e => {
        return [e.id, e.type].join();
    });
    return (
        <>
            <Head>
                <title>Video {tabName && `| ${tabName}`}</title>
            </Head>
            {bannerSection &&
                bannerSection.type === SectionType.BANNER &&
                bannerSection.content &&
                bannerSection.content?.length > 0 && (
                    <Box sx={{ mt: ['0px', '0px', '40px'] }}>
                        <SwiperCarouselDynamic
                            banners={bannerSection.content || []}
                            key="videos-carousel"
                            refer={{
                                col: String(bannerSection.id),
                                sect: bannerSection.type,
                                page: REFER_PAGES.HOME_VIDEOS,
                            }}
                        />
                    </Box>
                )}
            <InfiniteScroll
                dataLength={dataWhenfilter.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={<ListSpinner />}
                style={{ overflow: 'unset' }}>
                <ResponsiveContainer>
                    {tabsSection && tabsSection.content && tabsSection.content.length > 0 && (
                        <Box mt={5} key={tabsSection.id}>
                            <ScrollSelection
                                selectList={tabsSection.content ?? []}
                                defaultSelect={catId}
                                onSelect={(id: number) => selectTab(id)}
                                variant="box.selectionWhite"
                            />
                        </Box>
                    )}
                    {data.length ? (
                        <Box mt={5}>
                            {dataWhenfilter.map((section, idx) => {
                                if (section.type === SectionType.RECOMMEND && section.itemType === ContentType.VOD)
                                    return (
                                        <RecommendVods
                                            key={`${section.id}_${idx}`}
                                            defaultData={section}
                                            onClickSection={onClickSection}
                                            onClickItem={onClickPlayVod}
                                        />
                                    );
                                if (!section.content || section.content.length === 0) {
                                    return null;
                                }
                                switch (section.type) {
                                    case SectionType.VOD:
                                        return (
                                            <Section
                                                key={section.id}
                                                name={section.name}
                                                itemLength={section.content?.length}
                                                onClick={() => onClickSection(String(section.id))}
                                                link={{
                                                    href: `/videos/[catSlug]/[detailCatSlug]?c=${catId}&ch=${section.id}`,
                                                    as: `/videos/${router.query.catSlug}/${section.slug ||
                                                        section.id}?c=${catId}&ch=${section.id}`,
                                                }}>
                                                <VideoSlider
                                                    items={section.content}
                                                    oneLine
                                                    type={section.type}
                                                    refer={{
                                                        col: String(section.id),
                                                        sect: section.type,
                                                        page: REFER_PAGES.HOME_VIDEOS,
                                                        tab: catId ? String(catId) : undefined,
                                                    }}
                                                    onClickItem={item => {
                                                        onClickPlayVod({ id: item.id }, section.id);
                                                    }}
                                                />
                                            </Section>
                                        );
                                }
                                return null;
                            })}
                        </Box>
                    ) : !loading ? (
                        <NoData />
                    ) : null}
                </ResponsiveContainer>
            </InfiniteScroll>
        </>
    );
};

export default VideoCategoriesPage;
******************************************************************************************************Selection
import NextIcon from 'assets/icons/next.svg';
import PrevIcon from 'assets/icons/prev.svg';
import { ButtonRoundEffect, ScrollMenu, TextOneLine } from 'components';
import Link, { LinkProps } from 'next/link';
import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from 'theme-ui';

interface Option {
    id: number;
    name: string;
    Icon?: React.FC<React.SVGAttributes<{}>>;
    link?: string;
    secured?: boolean;
}

export const SelectItem = (props: {
    item: Option;
    variantSelect: string;
    variant?: string;
    onClick: () => void;
    selected: boolean;
    fontSize?: number;
    link?: LinkProps;
    mr?: number | number[];
    maxWidth?: number | number[];
}) => {
    const { item, variant, variantSelect, onClick, selected, fontSize, link, mr, maxWidth } = props;
    const content = item.Icon ? (
        <Box sx={{ flex: '0 0 auto', svg: { path: { fill: selected ? 'primary' : 'whiteText' } } }}>
            <item.Icon display="block" />
        </Box>
    ) : (
        <TextOneLine
            title={item.name}
            onClick={onClick}
            sx={{
                fontSize: fontSize || 5,
                maxWidth: maxWidth || 110,
            }}>
            {item.name}
        </TextOneLine>
    );

    return (
        <Box
            variant={selected ? variantSelect : variant || 'box.select'}
            sx={{
                mr: mr,
                flexShrink: 0,
                textAlign: 'center',
            }}>
            {link ? (
                <Link {...link} passHref>
                    <a>{content}</a>
                </Link>
            ) : (
                content
            )}
        </Box>
    );
};

export const Selection = (props: {
    selectList: Array<Option>;
    defaultSelect?: number;
    variant?: string;
    variantSelect: string;
    onSelect?: (id: number) => void;
    fontSize?: number;
    mr?: number | number[];
    maxWidth?: number | number[];
}) => {
    const { selectList, variant, variantSelect, defaultSelect, onSelect: onAction, fontSize, mr, maxWidth } = props;
    const [selectId, setSelectId] = useState(defaultSelect);
    const clickHighLight = (id: number) => {
        setSelectId(id);
        onAction?.(id);
    };
    useEffect(() => {
        setSelectId(defaultSelect);
    }, [defaultSelect]);

    return (
        <Flex
            sx={{
                borderRadius: 8,
                marginTop: '8px',
                alignItems: 'center',
            }}>
            {selectList.map((item, idx) => (
                <SelectItem
                    mr={idx < selectList.length - 1 ? mr : 0}
                    maxWidth={maxWidth}
                    item={item}
                    link={item.link ? { href: item.link } : undefined}
                    key={idx}
                    variant={variant}
                    variantSelect={variantSelect}
                    selected={selectId === item.id}
                    fontSize={fontSize}
                    onClick={() => clickHighLight(item.id)}
                />
            ))}
        </Flex>
    );
};

export const SelectScrollItem = (props: {
    item: Option;
    variant: string;
    onClick: () => void;
    selectedId: number;
    fontSize?: number;
    link?: LinkProps;
    mr?: number;
}) => {
    const { item, variant, onClick, selectedId, fontSize, link, mr } = props;
    return (
        <Box
            variant={selectedId === item.id ? variant : 'box.select'}
            sx={{
                mr: mr,
                flexShrink: 0,
                overflow: 'hidden',
                textAlign: 'center',
            }}
            onClick={onClick}>
            {link ? (
                <Link {...link} passHref>
                    <Text
                        aria-label={item.name}
                        sx={{
                            fontSize: fontSize || 5,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                        as="a">
                        {item.name}
                    </Text>
                </Link>
            ) : (
                <Text
                    sx={{
                        fontSize: fontSize || 5,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                    {item.name}
                </Text>
            )}
        </Box>
    );
};

export const ScrollSelection = (props: {
    selectList: Array<Option>;
    defaultSelect: number;
    variant: string;
    onSelect?: (id: number) => void;
    fontSize?: number;
    mr?: number;
}) => {
    const { selectList, variant, defaultSelect, onSelect: onAction, fontSize, mr } = props;
    const [selectId, setSelectId] = useState(defaultSelect);
    const clickHighLight = (id: number) => {
        setSelectId(id);
        onAction?.(id);
    };
    useEffect(() => {
        setSelectId(defaultSelect);
    }, [defaultSelect]);
    const menuData = () => {
        return selectList.map((item, idx) => {
            return (
                <SelectScrollItem
                    mr={idx < selectList.length - 1 ? mr : 0}
                    item={item}
                    link={item.link ? { href: item.link } : undefined}
                    key={`videos_tabs_${item.id}`}
                    variant={variant}
                    selectedId={selectId}
                    fontSize={fontSize}
                    onClick={() => clickHighLight(item.id)}
                />
            );
        });
    };
    return (
        <ScrollMenu
            data={menuData()}
            arrowLeft={
                <ButtonRoundEffect
                    aria-label="prev"
                    variant="wrapper"
                    sx={{
                        width: '40px',
                        height: '40px',
                        marginLeft: '-12px',
                        marginTop: '-12px',
                        svg: { display: 'block', width: '20px', height: '20px' },
                    }}>
                    <PrevIcon />
                </ButtonRoundEffect>
            }
            arrowRight={
                <ButtonRoundEffect
                    aria-label="next"
                    variant="wrapper"
                    sx={{
                        width: '40px',
                        height: '40px',
                        marginRight: '-12px',
                        marginTop: '-12px',
                        svg: { display: 'block', width: '20px', height: '20px' },
                    }}>
                    <NextIcon />
                </ButtonRoundEffect>
            }
            wheel={false}
            hideSingleArrow
            hideArrows
            alignCenter={false}
            scrollToSelected
            selected={`videos_tabs_${selectId}`}
        />
    );
};

Selection.defaultProps = {
    fontSize: false,
};
SelectItem.defaultProps = {
    fontSize: false,
};
*********************************************************************************ScrollMenu


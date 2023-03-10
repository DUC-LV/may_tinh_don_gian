INDEX
import React, {useState, useEffect, useCallback} from "react";
import {GetServerSideProps} from "next";
// import getHome from "@/src/services/getHome";
import ReponsiveContainer from "@/src/components/ReposiveContainer";
import {BannerSlider, PlaylistSlider} from "@/src/components/Slider";
import axios from "axios";

type Props = {
	data: any;
}
export const getServerSideProps: GetServerSideProps<Props> = async () => {
	let res = null;
	try {
		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
			// proxy: {
			// 	host: 'proxy-tct',
			// 	port: 3128,
			// }
		}
		res = await axios.get('http://192.168.146.1:9000/public/v1/common/get-setting?v=23213', options)
	} catch (e) {
		console.log('err', e);
	}
	return {
		props: {
			data: null,
		}
	}
}
const SectionType = {
	banner: "banner",
	playlist: "playlist"
}
const Home = () => {
	const [data, setData] = useState<any>([]);
	// useEffect(() => {
	// 	getHome.getAll().then(res => {
	// 		setData(res.data.data.items);
	// 	})
	// }, [])
	const generateContent = useCallback(() => {
		return data?.map((section:any, idx:number) => {
			if(!section.items || section.items.length === 0){
				return null;
			}
			switch (section.sectionType){
				case SectionType?.banner:
					return (
						<BannerSlider
							banners={section?.items}
							key={idx}
						/>
					)
				case SectionType.playlist:
					return (
						<PlaylistSlider
							key={idx}
							playlists={section.items}
							title={section.title}
						/>
					)
			}
		})
	}, [data])
	return(
		<ReponsiveContainer>
			{generateContent()}
		</ReponsiveContainer>
	);
}
export default Home;
*************************************************************************************Slider
import React from "react";
import {Box, Image} from "theme-ui";
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import {Banner, Playlist } from "@/src/schemas";
import {TextLineClamp, TextOnline} from "@/src/components/Text";


export const BannerSlider = (props: { banners: Array<Banner> }) => {
	const { banners } = props;
	return(
		<Box>
			<Swiper
				slidesPerView={3}
			>
				{banners?.map((item, index) => (
					<SwiperSlide key={index} style={{ padding: '0 10px '}}>
						<Image
							alt=""
							src={item.banner}
							sx={{ borderRadius: '8px' }}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</Box>
	);
}


export const PlaylistSlider = (props: { playlists: Array<Playlist>, title: string} ) => {
	const { playlists, title } = props;
	return(
		<Box>
			<TextOnline sx={{ margin: '20px 10px 0 10px' }}>{title}</TextOnline>
			<Swiper
				slidesPerView={4}
			>
				{playlists.map((item, index) => (
					<SwiperSlide key={index} style={{ padding: '0 10px '}}>
						<Image
							alt=""
							src={item.thumbnail_m}
							sx={{ borderRadius: '8px' }}
						/>
						<Box sx={{ mt: '10px' }}>
							<TextOnline
								sx={{
									fontSize: '14px',
									fontWeight: '700',
									color: 'white',
									marginBottom: '6px'
								}}
							>{item.title}</TextOnline>
							<TextLineClamp line={2}>{item.sort_description}</TextLineClamp>
						</Box>
					</SwiperSlide>
				))}
			</Swiper>
		</Box>
	)
}
**********************************************************schemas.ts
export interface Banner {
	id?: number,
	type?: number,
	banner?: string,
	cover?: string,
}
export interface Playlist {
	id?: number,
	title?: string,
	sort_description?: string,
	thumbnail_m?: string,
}

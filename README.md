************************************************************************** Header
import React, {PropsWithChildren} from "react";
import {Box, Flex, Image, Text, Button} from "theme-ui";
import { useRouter } from "next/router";
import { BsFillPersonFill, BsMusicNoteBeamed } from "react-icons/bs";
import { BiRadioCircleMarked, BiBarChart, BiListCheck, BiCategoryAlt } from "react-icons/bi";
import { AiOutlineStar, AiOutlineVideoCamera } from "react-icons/ai";
import {TextOneLine} from "@/src/components/Text";

interface ItemProps {
	link?: string,
	isActive?: boolean,
	onClick?: () => void,
	icon?: any,
	name?: string,
	title?: string,
	backgroundColor?: string,
}
const Items = ({ link, isActive, onClick, icon, name }: PropsWithChildren<ItemProps>) => {
	return(
		<Flex
			sx={{
				height: '32px',
				padding: '8px 25px',
				alignItems: 'center',
				marginY: '5px',
				background: isActive ? '#3a3344' : '',
			}}
			onClick={onClick}
		>
			<Box sx={{ height: '20px', width: '20px' }}>{icon}</Box>
			<TextOneLine
				sx={{
					fontSize: '16.5px',
					fontWeight: '700',
					color: '#DADADA',
					margin: '1px 10px',
					cursor: 'pointer',
					fontFamily: 'sans-serif',
					"@media screen and (max-width: 1133px)": {
						display: 'none'
					}
				}}
			>{name}</TextOneLine>
		</Flex>
	);
}

const ButtonItems = ({ title, name, backgroundColor }: PropsWithChildren<ItemProps>) => {
	return(
		<Flex
			sx={{
				height: '90px',
				width: '200px',
				margin: '10px 20px',
				flexDirection: 'column',
				borderRadius: '8px',
				background: '#9b4de0',
				alignItems: 'center',
				"@media screen and (max-width: 1133px)": {
					display: 'none'
				}
			}}
		>
			<Text
				as="h6"
				sx={{
					fontSize: '13px',
					fontWeight: '600',
					textAlign: 'center',
					margin: '10px 10px',
					color: 'white'
				}}
			>{title}</Text>
			<Button
				sx={{
					height: '30px',
					width: '145px',
					border: '1px solid white',
					fontSize: '12px',
					margin: '0 auto',
					borderRadius: '20px',
					color: 'black',
					fontWeight: '600',
					cursor: 'pointer',
					backgroundColor: backgroundColor,
				}}
			>{name}</Button>
		</Flex>
	)
}
const Header = () => {
	const router = useRouter();
	const menu = [
		{
			id: 1,
			type: '',
			name: 'Cá Nhân',
			link: '',
			isActive: (pathName: string) => /^\/tv/.test(pathName),
			icon: <BsFillPersonFill color="#DADADA" style={{ height: '18px', width: '18px', cursor: 'pointer'}}/>
		},
		{
			id: 2,
			type: '',
			name: 'Khám Phá',
			link: '/',
			isActive: (pathName: string) => router.pathname === '/',
			icon: <BiRadioCircleMarked color="#DADADA" style={{ height: '18px', width: '18px', cursor: 'pointer'}}/>
		},
		{
			id: 3,
			type: '',
			name: '#zingchart',
			link: '',
			isActive: (pathName: string) => /^\/tv/.test(pathName),
			icon: <BiBarChart color="#DADADA" style={{ height: '18px', width: '18px', cursor: 'pointer'}}/>
		},
		{
			id: 4,
			type: '',
			name: 'Theo Dõi',
			link: '',
			isActive: (pathName: string) => /^\/tv/.test(pathName),
			icon: <BiListCheck color="#DADADA" style={{ height: '18px', width: '18px', cursor: 'pointer'}}/>
		},
	];

	const category = [
		{
			id: 1,
			type: '',
			name: 'Nhạc Mới',
			link: '',
			isActive: (pathName: string) => /^\/tv/.test(pathName),
			icon: <BsMusicNoteBeamed color="#DADADA" style={{ height: '18px', width: '18px', cursor: 'pointer'}}/>
		},
		{
			id: 2,
			type: '',
			name: 'Thể Loại',
			link: '/',
			isActive: (pathName: string) => /^\/tv/.test(pathName),
			icon: <BiCategoryAlt color="#DADADA" style={{ height: '18px', width: '18px', cursor: 'pointer'}}/>
		},
		{
			id: 3,
			type: '',
			name: 'Top 100',
			link: '',
			isActive: (pathName: string) => /^\/tv/.test(pathName),
			icon: <AiOutlineStar color="#DADADA" style={{ height: '18px', width: '18px', cursor: 'pointer'}}/>
		},
		{
			id: 4,
			type: '',
			name: 'MV',
			link: '',
			isActive: (pathName: string) => /^\/mv/.test(pathName),
			icon: <AiOutlineVideoCamera color="#DADADA" style={{ height: '18px', width: '18px', cursor: 'pointer'}}/>
		},
	];
	return(
		<Box
			sx={{
				width: '240px',
				height: '100%',
				position: 'fixed',
				top: 0,
				left: 0,
				background: '#231b2e',
				"@media screen and (max-width: 1133px)": {
					width: '70px'
				}
			}}
		>
			<Flex
				onClick={() => router.push('/')}
				sx={{
					height: '70px',
					width: '240px',
					padding: '0px 25px',
					alignItems: 'center',
					marginY: '5px',
					"@media screen and (max-width: 1133px)": {
						display: 'none'
					}
				}}
			>
				<Image
					alt=""
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/ZingMP3logo.svg/2560px-ZingMP3logo.svg.png"
					sx={{
						height: '40px',
						width: '120px',
						cursor: 'pointer'
					}}
				/>
			</Flex>
			<Flex
				onClick={() => router.push('/')}
				sx={{
					justifyContent: 'center',
					padding: '10px 10px',
					"@media screen and (min-width: 1133px)": {
						display: 'none'
					}
				}}
			>
				<Image
					alt=""
					src="https://tse1.mm.bing.net/th?id=OIP.ARn_6iasoaMH7Lwk43lmbwHaHa&pid=Api&P=0"
					sx={{
						height: '50px',
						width: '50px',
						borderRadius: '999px',
						cursor: 'pointer'
					}}
				/>
			</Flex>
			<Flex sx={{ flexDirection: 'column', marginTop: '20px' }}>
				{menu?.map((item:any, index) => {
					return(
						<Box key={index}>
							<Items link={item?.link} isActive={item?.isActive()} icon={item?.icon} name={item?.name}/>
						</Box>
					)
				})}
			</Flex>
			<Flex sx={{ height: '0.5px', width: '86%', background: '#393243', margin: '5px auto'}}></Flex>
			<Flex sx={{ flexDirection: 'column', marginTop: '10px' }}>
				{category?.map((item:any, index) => {
					return(
						<Box key={index}>
							<Items link={item?.link} isActive={item?.isActive()} icon={item?.icon} name={item?.name}/>
						</Box>
					)
				})}
			</Flex>
			<ButtonItems
				title={'Đăng nhập để khám phá playlist dành riêng cho bạn'}
				name={'Đăng nhập'}
				backgroundColor={'#a55fe3'}
			/>
			<ButtonItems
				title={'Nghe nhạc không quảng cáo cùng kho nhạc VIP'}
				name={'Nâng cấp VIP'}
				backgroundColor={'yellow'}
			/>
		</Box>
	);
}
export default Header;
****************************************************************SearchBar
import React, {PropsWithChildren, useState, useRef, useEffect} from "react";
import { Box, Flex, Input } from 'theme-ui';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineSearch, AiFillSetting } from "react-icons/ai";
import { BsArrowBarUp } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import {useRouter} from "next/router";
import useOnClickOutside from "use-onclickoutside";

interface ItemProps {
	icon?: string,
}
const IconSearchBar = ({ icon }: PropsWithChildren<ItemProps>) => {
	return(
		<Flex
			sx={{
				height: '40px',
				width: '40px',
				borderRadius: '999px',
				background: '#ffffff1a',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
				":hover": {
					background: '#ffffff0d',
				},
				marginRight: '10px',
			}}
		>
			<Flex sx={{ justifyContent: 'center', alignItems: 'center'}}>{icon}</Flex>
		</Flex>
	)
}

const InputSearch = () => {
	const router = useRouter();
	const [searchTxt, setSearchTxt] = useState('');
	const searchBoxRef = React.useRef(null);
	const [dropdownSearchVisible, setDropdownSearchVisible] = React.useState(false);
	useOnClickOutside(searchBoxRef,() => {
		setDropdownSearchVisible(false);
	})
	const focusSearch = () => {
		setDropdownSearchVisible(true);
	};
	const gotoSearchPage = () => {
		if(!searchTxt){
			return;
		}else {
			router.push('')
		}
	}
	return(
		<Flex
			sx={{
				height: '40px',
				width: '400px',
				background: '#ffffff1a',
				borderRadius: '20px',
				position: 'relative',
			}}
		>
			<Box>
				<AiOutlineSearch
					style={{
						height: '20px',
						width: '20px',
						color: '#DADADA',
						position: 'absolute',
						left: '10px',
						top: '10px',
					}}
				/>
			</Box>
			<Input
				placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát ..."
				sx={{
					position: 'absolute',
					left: '38px',
					right: '10px',
					top: '0',
					height: '98%',
					maxWidth: '350px',
					width: '100%',
					border: 'none',
					outline: 'none',
					color: 'white',
					"::placeholder": {
						color: 'rgba(255, 255, 255, 0.5)',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}
				}}
			/>
		</Flex>
	)
}
const SearchBar = () => {
	const icon = [
		{
			icon: <BsArrowBarUp />
		},
		{
			icon: <AiFillSetting />
		},
		{
			icon: <RxAvatar />
		}
	]
	const router = useRouter();

	return(
		<Flex
			sx={{
				height: '70px',
				position: 'fixed',
				left: '240px',
				top: '0',
				right: '0',
				padding: '0px 60px',
				justifyContent: 'space-between',
				boxShadow: '',
				"@media screen and (max-width: 1133px)": {
					left: '70px',
					padding: '0 20px',
				}
			}}
		>
			<Flex
				sx={{
					alignItems: 'center',
					justifyContent: 'flex-start',
					flexGrow: '1',
				}}
			>
				<AiOutlineArrowLeft
					style={{
						height: '24px',
						width: '24px',
						color: '#DADADA',
						marginRight: '20px'
					}}
				/>
				<AiOutlineArrowRight
					style={{
						height: '24px',
						width: '24px',
						color: '#DADADA',
						marginRight: '20px'
					}}
				/>
				<InputSearch />
			</Flex>
			<Flex sx={{ justifyContent: 'flex-end', alignItems: 'center'}}>
				{icon?.map((item:any, index) => {
					return(
						<Flex key={index}>
							<IconSearchBar icon={item.icon}/>
						</Flex>
					);
				})}
			</Flex>
		</Flex>
	);
}
export default SearchBar;
*********************************************************************************axiosInstan
import axios from 'axios';
const baseURL = 'http://localhost:8000';

let axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 500,
	headers: {
		Authorization: '*',
		'Content-Type': 'application/json',
		accept: 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
	},
	proxy: {
		host: 'proxy-tct:3128',
		port: 3000,
	}
});
export default axiosInstance;
************************************************************ getHome
import axiosInstance from "@/src/services/axiosInstance";

const getHome = {
	getAll(){
		const url = 'public/v1/composite/get-home/';
		return axiosInstance.get(url)
	}
}
export default getHome;
********************************************************** index
import React, { useState, useEffect } from "react";
import {GetServerSideProps} from "next";
import getHome from "@/src/services/getHome";

type Props = {
	data: Array<object>
}
export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const res = await getHome.getAll();
	return {
		props: {
			data: res.data
		}
	}
}
const Home = ({ data }: Props) => {
	console.log(data)
	useEffect(() => {
		getHome.getAll().then(res => {
			console.log(res.data)
		})
	}, [])
	return(
		<div></div>
	);
}
export default Home;

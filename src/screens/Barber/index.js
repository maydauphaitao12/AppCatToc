import React, {useState, useEffect} from 'react';
import { Text } from 'react-native';
import BarberModal from '../../components/BarberModal';

import { useNavigation, useRoute } from '@react-navigation/native';
import Api from '../../Api';
import Swiper from 'react-native-swiper';
import { ScrollView } from 'react-native-gesture-handler';
import FavoriteIcon from '../../assets/favorite.svg';
import BackIcon from '../../assets/back.svg';
import FavoriteFullIcon from '../../assets/favorite_full.svg';
import NavPrevIcon from '../../assets/nav_prev.svg';
import NavNextIcon from '../../assets/nav_next.svg';

import { 
    Container,
    Scroller,
    PageBody,
    BackButton,
    LoadingIcon,

    SwipeDot,
    SwipeDotActive,
    SwipeItem,
    SwipeImage,
    FakeSwiper,
 
    UserInfoArea,
    UserAvatar,
    UserInfo,
    UserInfoName,
    UserFavButton,

    ServiceArea,
    ServiceItem,
    ServicesTitle,
    ServiceInfo,
    ServiceName,
    ServicePrice,
    ServiceChooseButton,
    ServiceChooseButtonText,

    TestimonialArea,
    TestimonialItem,
    TestimonialInfo,
    TestimonialName,
    TestimonialBody,

} from './styles';

import Stars from '../../components/Stars';

export default () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [userInfor, setUserInfo] = useState({
        id: route.params.id,
        avatar: route.params.avatar,
        name: route.params.name,
        stars: route.params.stars,
    });

    const [loading, setLoading] = useState(false);
    const [favorited,setFavorited] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        const getBarberInfo = async () => {
            setLoading(true);

            let json = await Api.getBarber(userInfor.id);
            if(json.error == ''){
                setUserInfo(json.data);
                setFavorited(json.data.favorited);  

                // console.log(json.data.available);
            }
            else {
                alert('Error: ' + json.error);
            }

            setLoading(false);
        }
        getBarberInfo();
    }, []);

    

    const handleBackButton = () =>{
        navigation.goBack();
    }

    //làm hình trái tim đổi sang đỏ

    const handleFavClick = () => {
        setFavorited( !favorited);
        Api.setFavorite(userInfor.id);
    }

    const handleServiceChoose = (key) => {
        setSelectedService(key);
        setShowModal(true);
    }

    return (
        <Container>
            <Scroller>
                {userInfor.photos && userInfor.photos.length > 0 ?
                    <Swiper
                        style = {{height: 240}}
                        dot = {<SwipeDot /> }
                        activeDot = {<SwipeDotActive /> }
                        paginationStyle = {{top:15, right:15, bottom: null, left: null}}
                        autoplay= {true}
                    >
                        {userInfor.photos.map((item,key) => (
                            <SwipeItem key = {key}>
                                <SwipeImage source = {{uri:item.url}} resizeMode = "cover" /> 
                            </SwipeItem>
                        ))}
                        
                    </Swiper>
                    :
                    <FakeSwiper>

                    </FakeSwiper>    
                }
                <PageBody>
                    <UserInfoArea>
                        <UserAvatar source= {{uri:userInfor.avatar}} />

                        <UserInfo>
                            <UserInfoName>{userInfor.name}</UserInfoName>
                            <Stars stars = {userInfor.stars} showNumber={true} />
                        </UserInfo>

                        <UserFavButton onPress={handleFavClick}>
                            {favorited ?
                                <FavoriteFullIcon width= "24" height = "24" fill="#FF0000" />
                                :
                                <FavoriteIcon width= "24" height = "24" fill="#FF0000" />
                            }

                            
                        </UserFavButton>

                    </UserInfoArea>

                    {loading && 
                        <LoadingIcon size="large" color= "#000000" />
                    }

                    {userInfor.services && 
                        <ServiceArea>
                            <ServicesTitle>Danh sách các dịch vụ</ServicesTitle>

                            {userInfor.services.map((item,key) =>(
                                <ServiceItem key={key}>                       
                                    <ServiceInfo>
                                        <ServiceName>{item.name}</ServiceName>
                                        <ServicePrice>R$ {item.price.toFixed(2)}</ServicePrice>
                                    </ServiceInfo>
                                    <ServiceChooseButton onPress={() =>handleServiceChoose(key)}>
                                        <ServiceChooseButtonText>Lên Lịch</ServiceChooseButtonText>
                                    </ServiceChooseButton>
                                </ServiceItem>
                            ))}
                        </ServiceArea>

                    }   

                    {userInfor.Testimonials && userInfor.Testimonials.length >0 &&         
                        <TestimonialArea>
                            <Swiper
                                style={{height: 110}}
                                showsPagination={false}
                                showsButtons = {true}
                                prevButton={<NavPrevIcon width="35" height="35" fill="#000000" />}
                                nextButton={<NavNextIcon width="35" height="35" fill="#000000" />}
                            >
                                {userInfor.Testimonials.map(()=>(
                                    <TestimonialItem key = {key} >
                                        <TestimonialInfo>
                                            <TestimonialName>{item.name}</TestimonialName>
                                            <Stars stars={item.rate} showNumber={false} />
                                        </TestimonialInfo>
                                        <TestimonialBody>{item.body}</TestimonialBody>
                                    </TestimonialItem>
                                ))}
                            </Swiper>
                        </TestimonialArea>
                    }   
                </PageBody>
            </Scroller>
            <BackButton onPress= {handleBackButton} >
                <BackIcon width="44" height= "44" fill ="#FFFFFF" />
            </BackButton>

            <BarberModal
                show = {showModal}
                setShow = {setShowModal}
                user = {userInfor}
                service = {selectedService}
            
            />
        </Container>

    );
}
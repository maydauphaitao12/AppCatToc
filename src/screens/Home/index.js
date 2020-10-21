
import React, { useState, useEffect } from 'react';
  
import { useNavigation } from '@react-navigation/native';

import { request, PERMISSIONS } from 'react-native-permissions';

import Geolocation from '@react-native-community/geolocation';

import { Platform, RefreshControl, FlatList } from 'react-native';

import BarberItem from '../../components/BarberItem';

import Api from '../../Api';

import { 
    Container,
    Scroller,

    HeaderArea,
    HeaderTitle,
    SearchButton,

    LocationArea,
    LocationInput,
    LocationFinder,
    LoadingIcon,
    ListArea


} from './styles';



import SearchIcon from '../../assets/search.svg';
import MyLocationIcon from '../../assets/my_location.svg';

export default () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing ] = useState(false);

    const [locationText, setLocationText] = useState('');
    const [coords, setCoods ] = useState(null);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);



    const handleLocationFinder = async () =>{
        setCoods(null);
        let result = await request(

            Platform.OS === 'ios' ?
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            :
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

        );

        if(result == 'granted') {
            setLoading(true);
            setLocationText('');
            setList([]);
            Geolocation.getCurrentPosition((info)=>{

                setCoods(info.coords);
                getBarbers();

            } );
        }

    }

    const getBarbers = async () =>{
        setLoading(true);
        setList([]);

        let lat = null;
        let lng = null;
        if(coords){
            lat = coords.latitude;
            lng = coords.longitude;
        }


        let res = await Api.getBarbers(lat,lng);
        if(res.error == '' ){
            if(res.loc){
                setLocationText(res.loc);
            }

            setList(res.data);
        }
        else {
            alert("Error: " + res.error);
        }
        setLoading(false);
    }

    useEffect (()=>{
        getBarbers();
    }, []);

    const onRefresh = () => {
        setRefreshing(false);
        getBarbers();
    }

    const handleLocationSearch = () => {
        setCoods({});
        getBarbers();
    }

    return (
        <Container>
            <Scroller refreshControl= {
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <HeaderArea>
                    <HeaderTitle numberOfLines={2}>Tìm kiếm</HeaderTitle>
                    <SearchButton onPress={()=>navigation.navigate('Search')}>
                        <SearchIcon width="26" height="26" fill="#FFFFFF" />
                    </SearchButton>
                </HeaderArea>

                <LocationArea>
                    <LocationInput 
                        placeholder="Search?"
                        placeholderTextColor="#FFFFFF"
                        value ={locationText}
                        onChangeText={t=>setLocationText(t)}
                        onEndEditing={handleLocationSearch}

                    />
                    <LocationFinder onPress={handleLocationFinder} >
                        <MyLocationIcon width="24" height="24" fill ="#FFFFFF" />
                    </LocationFinder>
                </LocationArea>


                {loading &&
                    <LoadingIcon size="large" color="#FFFFFF" />
                }

                <ListArea>
                    {list.map((item, k)=>(
                        <BarberItem key={k} data= {item} />
                    ))}
                </ListArea>
                

            </Scroller>
        </Container>
    );
}
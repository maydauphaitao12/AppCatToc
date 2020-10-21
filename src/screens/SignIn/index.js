import React, { useState, useContext } from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '../../contexts/UserContext';


import {
    Container,
    InputArea,
    CustomButton,
    CustomButtonText,
    SignMessageButton,
    SignMessageButtonText,
    SignMessageButtonTextBold
} from './styles';

import SignInput from '../../components/SignInput';
import Api from '../../Api'


import BarberLogo from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';

export default () => {
    const { dispatch: userDispatch } = useContext(UserContext);
    const [emailField,setEmailField] = useState('hoangviet@gmail.com');
    const [passwordField,setPassWordField] = useState('');

    const navigation = useNavigation();

    const handleSignClick = async () => {
        if(emailField != '' && passwordField != ''){
            let json = await Api.signIn(emailField,passwordField);
            console.log(json);
            if(json.token) {
                await AsyncStorage.setItem('token',json.token);

                userDispatch({
                    type: 'setAvatar',
                    payload:{
                        avatar: json.data.avatar
                    }
                });

                navigation.reset({
                    routes:[{name: 'MainTab'}]
                });


            }
            else {
                alert ('Đăng nhập thất bại')
            }
            
        }
        else {
            alert("Không được bỏ trống");
        }
    }
    const handleMessageButtonClick = () => {
        navigation.reset({
            routes: [{name: 'SignUp'}]
        });
    }


    return(
        <Container>
            <BarberLogo width="100%" height="160"  />
            <InputArea>
                <SignInput 
                
                IconSvg = {EmailIcon}
                placeholder = "Mời nhập Email"
                value ={emailField}
                onChangeText = {t=>setEmailField(t)}
                
                />

                
                <SignInput 
                IconSvg = {LockIcon}
                placeholder = "Mời nhập mật khẩu"
                value = {passwordField}
                onChangeText = {t=>setPassWordField(t)}
                password = {true}
                />

                



                <CustomButton onPress={handleSignClick}>
                    <CustomButtonText>Đăng Nhập</CustomButtonText>
                </CustomButton>

            </InputArea>

            <SignMessageButton  onPress={handleMessageButtonClick}>
                <SignMessageButtonText>Bạn muốn đăng ký</SignMessageButtonText>
                <SignMessageButtonTextBold>Đăng ký</SignMessageButtonTextBold>
            </SignMessageButton>

        </Container>

    );
}
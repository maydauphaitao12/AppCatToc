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
import PersonIcon from '../../assets/person.svg';

export default () => {
    const { dispatch: userDispatch } = useContext(UserContext);

    const [nameField, setNameField] = useState('');

    const [emailField,setEmailField] = useState('hvviet1998@gmail.com');
    const [passwordField,setPassWordField] = useState('');

    const navigation = useNavigation();

    const handleSignClick = async () => {

        if(nameField != '' && emailField != '' && passwordField != ''){
            
            let res = await Api.signUp(nameField, emailField, passwordField);

            console.log(res);

            if(res.token){
                
                await AsyncStorage.setItem('token',res.token);

                userDispatch({
                    type: 'setAvatar',
                    payload:{
                        avatar: res.data.avatar
                    }
                });

                navigation.reset({
                    routes:[{name: 'MainTab'}]
                });



            }
            else {
                alert("Erro:  " +res.error);
            }


        }
        else {
            alert("Không được để trống")
        }

    }
    const handleMessageButtonClick = () => {
        navigation.reset({
            routes: [{name: 'SignIn'}]
        });
    }


    return(
        <Container>
            <BarberLogo width="100%" height="160"  />
            <InputArea>
                <SignInput 
                
                IconSvg = {PersonIcon}
                placeholder = "Mời nhập Tên"
                value ={nameField}
                onChangeText = {t=>setNameField(t)}
                
                />
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
                    <CustomButtonText>Đăng Ký</CustomButtonText>
                </CustomButton>

            </InputArea>

            <SignMessageButton  onPress={handleMessageButtonClick}>
                <SignMessageButtonText>Bạn đã có tài khoản</SignMessageButtonText>
                <SignMessageButtonTextBold>Đăng nhập</SignMessageButtonTextBold>
            </SignMessageButton>

        </Container>

    );
}
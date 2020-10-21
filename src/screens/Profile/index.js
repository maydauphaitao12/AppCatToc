import React from 'react';
import { Text, Button } from 'react-native';
import { Container } from './styles';
import Api from '../../Api'
import { useNavigation } from '@react-navigation/native';

export default () => {
    const navigation  = useNavigation();
    const handleLogoutClick = async () => {

        await Api.logout();
        navigation.reset({
            routes:[{name:'SignIn'}]
        });
    }
    return (
        <Container>
            
            <Button title = "LogOut" onPress={handleLogoutClick} />
        </Container>
    );
}
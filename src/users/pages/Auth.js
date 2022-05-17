import React, {useState, useContext} from "react";

import Card from "../../shared/UIElements/Card";
import Button from "../../shared/FormElements/Button";
import Input from "../../shared/FormElements/Input";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE  } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import './Auth.css'

const Auth = () => {

    const [isLoginMode, setIsLoginMode] = useState(true)

    const auth = useContext(AuthContext)

    const [formState, inputHandler, setFormData] = useForm({
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
    }, 
    false
)

const swtichModeHandler = () => {
    if(!isLoginMode) {
        setFormData(
        {
            ...formState.inputs,
            name:  undefined
        }, 
        formState.inputs.email.isValid && formState.inputs.password.isValid)
    } else {
        setFormData({
            ...formState.inputs,
            name: {
                value: '',
                isValid: false
            }
        }, false)
    }
    setIsLoginMode(prevMode => !prevMode)
}

const authSubmitHandler = event => {
    event.preventDefault()
    console.log(formState.inputs)
    auth.login()
}

    return (
        <Card className='authentication'>
            <h2>Login Required</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && <Input 
                     element="input" 
                     id="name" 
                     type="text" 
                     label="Your name" 
                     validators={[VALIDATOR_REQUIRE()]} 
                     errorText="Please enter a name"
                     onInput={inputHandler}
                     />}
                <Input 
                element="input" 
                id="email" 
                type="email" 
                label="E-mail" 
                validators={[VALIDATOR_EMAIL()]} 
                errorText="Please enter a valid email"
                onInput={inputHandler}
                >
                </Input> 
                <Input 
                element="input" 
                id="password" 
                type="password" 
                label="password" 
                validators={[VALIDATOR_MINLENGTH(5)]} 
                errorText="Please enter a valid password, at least 5 characters"
                onInput={inputHandler}
                >
                </Input>
                <Button type="submit" disabled={!formState.isValid}>
                    {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                </Button> 
                <Button inverse onClick={swtichModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button> 
            </form>
        </Card>
    )
}

export default Auth
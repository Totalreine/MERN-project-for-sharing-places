import React, {useState, useContext} from "react";

import Card from "../../shared/UIElements/Card";
import Button from "../../shared/FormElements/Button";
import Input from "../../shared/FormElements/Input";
import ErrorModal from "../../shared/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner"
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE  } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/FormElements/ImageUpload";
import './Auth.css'


const Auth = () => {
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true)
    const  {isLoading, error, sendRequest, clearError} = useHttpClient()

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
            name:  undefined,
            image: undefined
        }, 
        formState.inputs.email.isValid && formState.inputs.password.isValid)
    } else {
        setFormData({
            ...formState.inputs,
            name: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        }, false)
    }
    setIsLoginMode(prevMode => !prevMode)
}

const authSubmitHandler = async event => {
    event.preventDefault()
    console.log(formState.inputs)

    if(isLoginMode) {
        try {
            const responseData = await sendRequest(
                'http://localhost:5000/api/users/login', 
                'POST',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {'Content-Type': 'application/json'}
                )
    
                auth.login(responseData.user.id)
        } catch (err) {

        }
    } else {
         try {
            const formData = new FormData()
            formData.append('email', formState.inputs.email.value)
            formData.append('name', formState.inputs.name.value)
            formData.append('password', formState.inputs.password.value)
            formData.append('image', formState.inputs.image.value)
            const responseData =  await sendRequest(
                'http://localhost:5000/api/users/signup', 
                'POST',
                formData
                )

            auth.login(responseData.user.id)
        }    
            catch (err) {
          
        }
    }   
     
}

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className='authentication'>
                {isLoading && <LoadingSpinner asOverLay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (<Input 
                    element="input" 
                    id="name" 
                    type="text" 
                    label="Your name" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText="Please enter a name"
                    onInput={inputHandler}
                    />
                    )}
                    {!isLoginMode && <ImageUpload  center id='image' onInput={inputHandler} />}
                    <Input 
                    element="input" 
                    id="email" 
                    type="email" 
                    label="E-mail" 
                    validators={[VALIDATOR_EMAIL()]} 
                    errorText="Please enter a valid email"
                    onInput={inputHandler}
                    />
                    
                    <Input 
                    element="input" 
                    id="password" 
                    type="password" 
                    label="Password" 
                    validators={[VALIDATOR_MINLENGTH(6)]} 
                    errorText="Please enter a valid password, at least 6 characters"
                    onInput={inputHandler}
                    />
                    
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button> 
                </form>
                <Button inverse onClick={swtichModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button> 
                
            </Card>
       </React.Fragment>
    )
}

export default Auth

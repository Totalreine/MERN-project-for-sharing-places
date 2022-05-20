import React, {useContext} from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button"
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner"
import './NewPlace.css'

  
const NewPlace = () => {
    const auth = useContext(AuthContext)
    const  {isLoading, error, sendRequest, clearError} = useHttpClient()
    const [formState, inputHandler] = useForm(
        {
            title:{
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            

        },
        false
    )
   
    const history = useHistory()  

      const placeSubmitHandler  = async event => {
          event.preventDefault()

          try {
            await sendRequest(
            'http://localhost:5000/api/places', 
            'POST', 
            JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
                address: formState.inputs.address.value,
                creator: auth.userId
            }),
            {'Content-Type' : 'application/json'}
          )
          history.push('/')
          } catch (err) {

          }                    
      }

    return ( 
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
            {isLoading && <LoadingSpinner asOverLay />}
                <Input 
                id='title'
                element="input" 
                type="text" 
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please  enter a valid title' 
                onInput={inputHandler}
                />
                <Input 
                id='description'
                element="textarea" 
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText='Please  enter a valid description (at least 5 characters).' 
                onInput={inputHandler }
                />
                <Input 
                id='address'
                element="input" 
                label="Adress"
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please  enter a valid address.' 
                onInput={inputHandler }
                />
                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
    </React.Fragment>
    )
}

export default NewPlace;
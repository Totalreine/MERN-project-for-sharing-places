import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import './NewPlace.css'


const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State',
        description: 'Great building',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State',
        description: 'Great building',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
]

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true)
    const placeId = useParams().placeId;

    const [formState, inputHandler, setFormData] = useForm({
        title: {
        value: '',
        isValid: false
        }, 
        description: {
        value: '',
        isValid: false
        }  
    }, 
    false
)

const identifiedPlaces = DUMMY_PLACES.find(p => p.id === placeId);

useEffect(() => {
    setFormData({
        title: {
        value: identifiedPlaces.title,
        isValid: true
        }, 
        description: {
        value: identifiedPlaces.description,
        isValid: true
        }  
    }, 
    true
    );
    setIsLoading(false)
}, [setFormData, identifiedPlaces])

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs)
    }

    if(!identifiedPlaces) {
        return (
            <div className="center">
                <h2>Could not find place!</h2>
            </div>
        )
    }

    if(isLoading) {
        return (
            <div className="center">
                <h2>Loading...</h2>
            </div>
        )
    }

    return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input 
                id='title'
                element="input" 
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please  enter a valid title' 
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
                initialValid={formState.inputs.title.isValid}
            />
            <Input 
                id='description'
                element="textarea" 
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)] }
                errorText='Please  enter a valid description (at least 5 characters).' 
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
                initialValid={formState.inputs.description.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>
                ADD PLACE
            </Button>
        </form>
    )
}

export default UpdatePlace

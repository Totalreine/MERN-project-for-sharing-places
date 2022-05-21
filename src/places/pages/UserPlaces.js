import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom"

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner"

const UserPlaces = props => {
    const [loadedPlaces, setLoadedPlaces] = useState()
    const  {isLoading, error, sendRequest, clearError} = useHttpClient()

    const userId = useParams().userId;
    
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)
                setLoadedPlaces(responseData.places)
            } catch (err) {
                
            }
        }
        fetchPlaces()
    },  [sendRequest, userId])
    
    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
    }

    return (
        <React.Fragment>        
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (<div clasname="center"><LoadingSpinner/></div>)}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
        </React.Fragment>
    )
};

export default UserPlaces;


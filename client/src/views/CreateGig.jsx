import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import GigForm from '../components/GigForm'
import NavBar from '../components/NavBar'
import { toast } from 'react-toastify';
import image from '../images/backgroundimage.jpg'


const CreateGig = () => {
    const navigate = useNavigate();
    const [gig, setGig] = useState({});
    const [allGigs, setAllGigs] = useState([]);
    const [errors, setErrors] = useState([]);

    const newGig = async (gig) => {   
        console.log(gig)
        const {venue, date, streetAddress, city, state, zipCode, setUpBy, startTime, endTime, musicians} = gig;
        const gigData = {venue, date, streetAddress, city, state, zipCode, setUpBy, startTime, endTime, musicians};
        try {
            const newGig = await axios.post('http://localhost:8000/api/gigs/create', gigData)
            const formData = new FormData();
            formData.append('iRealCharts', gig.iRealCharts);
            formData.append('pdfCharts', gig.pdfCharts);
            formData.append('timeline', gig.timeline);
            formData.append('gigId', newGig.data._id);

            axios.put(`http://localhost:8000/api/gigs/uploadCharts/${newGig.data._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setGig(newGig.data)
            setAllGigs([...allGigs, newGig.data]);
            navigate('/AdminDashboard')
        } catch (err) {
            console.log(err.response.data.error.errors)
            const errorResponse = err.response.data.error.errors;
            const errorArray = [];
            for (const key of Object.keys(errorResponse)) {
                {errorArray.push(errorResponse[key].message)}
                toast.error(errorResponse[key].message)
        }
            setErrors(errorArray);
        }
    };

return (
    // <div style={{
    //     background: 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(0,107,141,1) 0%, rgba(0,69,91,1) 90%)',
    //     minHeight: "100vh"
    // }}>
    <div className='bg-image' style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: 'center',
        minHeight: '100vh',
    }}>
        <div className='pt-3 pb-5'>
            <NavBar/>
            <div className='container-fluid'>
                <h2 className="text-warning mx-auto mt-5">Create a new gig:</h2>
                <div>
                    {errors.map((err, index) => <p className='text-danger' key={index}>{err}</p>)}
                    <GigForm
                        onSubmitProp={newGig} 
                        initialVenue="" 
                        initialDate="" 
                        initialStreetAddress="" 
                        initialCity="" 
                        initialState=""  
                        initialZipCode="" 
                        initialSetUpBy="" 
                        initialStartTime="" 
                        initialEndTime=""  
                        initialMusicians={[]}
                        initialIRealCharts="" 
                        initialPdfCharts=""
                        initialTimeline=""/>
                </div>
            </div>
        </div>
    </div>
    )
}   

export default CreateGig
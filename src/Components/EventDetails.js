import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Container } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';

const EventDetails = ({ slotInfo, onEventData }) => {
    const [eventData, setEventData] = useState({
        id: slotInfo.id ? slotInfo.id : '',
        title: slotInfo.title ? slotInfo.title : '',
        start: slotInfo.start,
        end: slotInfo.end,
        location: slotInfo.data && slotInfo.data.location ? slotInfo.data.location : '',
        allDay: false,
        attendees: slotInfo.data && slotInfo.data.attendees ? slotInfo.data.attendees : []
    });
    
    // Function to format date to YYYY-MM-DDTHH:MM format required by datetime-local input
    const formatDate = (date) => {
        // Convert date to UTC format
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
        // Format to YYYY-MM-DDTHH:MM format
        return utcDate.toISOString().slice(0, 16);
    };

    // Function to handle data submission
    useEffect(() => {
        onEventData(eventData);
    }, [eventData]);

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Update the event data state based on the input type
        setEventData(prevEventData => ({
            ...prevEventData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAttendeesChange = (selectedOptions) => {
        // Extract email addresses from selected options
        const emails = selectedOptions.map(option => option.value);
        // Update eventData with email addresses
        setEventData(prevEventData => ({
            ...prevEventData,
            attendees: emails
        }));
    };

    return (
        <Container className='new-event-container'>
            <Form>
                <Form.Group as={Row} controlId="eventTitle">
                    <Form.Label column sm={2}>
                        Title
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Enter event title"
                            value={eventData.title}
                            onChange={handleInputChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="startTime">
                    <Form.Label column sm={2}>
                        Start Time
                    </Form.Label>
                    <Col sm={5}>
                        <Form.Control
                            style={{width: '300px'}}
                            type="datetime-local"
                            name="start"
                            disabled={eventData.allDay}
                            value={formatDate(new Date(eventData.start))}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col sm={5} style={{alignContent: 'center'}}> 
                        <Form.Check
                            type="checkbox"
                            name="allDay"
                            label="All Day Event"
                            checked={eventData.allDay}
                            onChange={handleInputChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="endTime">
                    <Form.Label column sm={2}>
                        End Time
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            style={{width: '300px'}}
                            type="datetime-local"
                            name="end"
                            disabled={eventData.allDay}
                            value={formatDate(new Date(eventData.end))}
                            onChange={handleInputChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="eventLocation">
                    <Form.Label column sm={2}>
                        Location
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="location"
                            placeholder="Enter event location"
                            value={eventData.location}
                            onChange={handleInputChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="eventAttendees">
                    <Form.Label column sm={2}>
                        Attendees
                    </Form.Label>
                    <Col sm={10} style={{marginTop: '5px'}}>
                        <CreatableSelect
                            isMulti
                            isClearable
                            creatable
                            name="attendees"
                            options={[]} 
                            onChange={handleAttendeesChange}
                            placeholder="Select attendees"
                            value={eventData.attendees.map(x => ({ label: x, value: x }))}
                            />
                    </Col>
                </Form.Group>

            </Form>
        </Container>
    );
};

export default EventDetails;

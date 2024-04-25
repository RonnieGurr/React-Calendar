import { useEffect, useState } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';

const ViewEvent = ({ currentEvent, onClose, editEvent, deleteEvent }) => {
    const [showViewWindow, setShowViewWindow] = useState(false);

    useEffect(() => {
        if (currentEvent.title) {
            setShowViewWindow(true)
        }
    }, [currentEvent]);

    const closeViewWindow = () => {
        setShowViewWindow(false);
        onClose(); // Call the onClose callback to reset the currentEvent state
    };

    const editCurrentEvent = () => {
        closeViewWindow()
        editEvent(currentEvent)
    }

    const handleDelete = () => {
        deleteEvent()
        closeViewWindow()
    }

    // Function to format date to DD-MM-YYYY TIME format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    return (
        <Modal show={showViewWindow} onHide={closeViewWindow} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>{currentEvent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <strong>Start:</strong> {currentEvent.start && formatDate(currentEvent.start)}
                    </Col>
                    <Col style={{textAlign: 'right'}}>
                        <strong>End:</strong> {currentEvent.end && formatDate(currentEvent.end)}
                    </Col>
                </Row>

                <hr />

                <>
                <Row>
                    <Col>
                        <strong>Attendees:</strong>
                    </Col>

                    <Col md={10}>
                        <CreatableSelect
                            value={currentEvent.data && currentEvent.data.attendees && currentEvent.data.attendees.length > 0
                                ? currentEvent.data.attendees.map(attendee => ({
                                    value: attendee,
                                    label: attendee
                                }))
                                : [{ value: 'No attendees invited', label: 'No attendees invited' }]
                            }
                            isMulti={currentEvent.data && currentEvent.data.attendees && currentEvent.data.attendees.length > 0 ? true : false}
                            isDisabled
                            name="attendees"
                        />
                    </Col>


                        
                    <Col>
                        <strong>Location:</strong>
                    </Col>
                    <Col md={10}>
                        <CreatableSelect
                            value={{
                                value: currentEvent.data && currentEvent.data.location ? currentEvent.data.location : "No location selected",
                                label: currentEvent.data && currentEvent.data.location ? currentEvent.data.location : "No location selected"
                            }}
                            isDisabled
                        />
                    </Col>

                    
                </Row>


                <hr />
                </>

                {currentEvent.data && currentEvent.data.HTMLMessage && currentEvent.data.HTMLMessage !== "<p><br></p>" && (
                    <div dangerouslySetInnerHTML={{ __html: currentEvent.data.HTMLMessage }}></div>
                )}

            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={editCurrentEvent}>
                    Edit Event
                </Button>

                <Button variant='danger' onClick={handleDelete} >
                    Delete Event
                </Button>

                <Button variant="secondary" onClick={closeViewWindow}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ViewEvent;

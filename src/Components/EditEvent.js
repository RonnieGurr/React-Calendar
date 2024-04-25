import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import CreateEventTabs from './CreateEventTabs';

const EditEvent = ({ show, handleClose, event, handleEventData, handleMessageData, handleUpdateEvent }) => {
    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Edit Event: {event.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CreateEventTabs
                    slotInfo={event}
                    onEventData={handleEventData}
                    onMessageData={handleMessageData}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={handleUpdateEvent}>
                    Update Event
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditEvent;

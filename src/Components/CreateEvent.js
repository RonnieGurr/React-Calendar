import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import CreateEventTabs from './CreateEventTabs';

const EventModal = ({ show, handleClose, newEvent, slotInfo, handleEventData, handleMessageData, handleSaveEvent }) => {
    
    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>{newEvent.title ? newEvent.title : 'New Event'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CreateEventTabs slotInfo={slotInfo} onEventData={handleEventData} onMessageData={handleMessageData} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={handleSaveEvent}>
                    Save Event
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EventModal;

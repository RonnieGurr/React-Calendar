import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import TextEditor from './TextEditor';
import EventDetails from './EventDetails';

const CreateEventTabs = ({ slotInfo, onEventData, onMessageData}) => {
    return (
        <Tabs defaultActiveKey="eventDetails" id="eventTabs">
            <Tab eventKey="eventDetails" title="Event Details">
                <EventDetails slotInfo={slotInfo} onEventData={onEventData} /> 
            </Tab>
            <Tab eventKey="editor" title="Message">
                <TextEditor onMessageData={onMessageData} initialMessage={slotInfo.data && slotInfo.data.HTMLMessage && slotInfo.data.HTMLMessage} />
            </Tab>
        </Tabs>
    );
};

export default CreateEventTabs;

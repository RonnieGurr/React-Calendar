import { useState } from 'react';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from 'moment';

import ViewEvent from './ViewEvent';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

moment.locale('en-GB')
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
const { v4: uuidv4 } = require('uuid');

const BigCalendar = () => {
    const [myEvents, setEvents] = useState([
        {
            id: uuidv4(), 
            start: (() => {
                const today = new Date();
                today.setHours(12, 0, 0, 0);
                return today;
            })(),
            end: (() => {
                const today = new Date();
                today.setHours(17, 0, 0, 0); 
                return today;
            })(),
            title: 'Test Event (Read me)',
            data: {
                attendees: ['ronnie.gurr@someaddress.com'],
                HTMLMessage: '<p><b>Hello Wolrd :)</b></p><p>I will be in HTML format ready for HTLM emails.</p><p>I can also convert into plain and rich text if needed.</p></p>Why not edit this event to see what formatting options I have?</p><p><b>Ronnie Gurr</b></p>',
                location: 'London Office',
            }
        }
    ])    

    const [newEvent, setNewEvent] = useState({
        start: new Date(), 
        end: new Date(), 
        title: '', 
        data: {}, 
    });
    
    const [slotInfo, setSlotInfo] = useState({});
    const [currentEvent, setCurrentEvent] = useState({});
    const [editEvent, setEditEvent] = useState({})
    
    //-----------------------------------------Window/Modal Controls---------------------------//
    const [showCreateWindow, setShowCreateWindow] = useState(false);
    const closeCreateWindow = () => setShowCreateWindow(false);

    const [showEditWindow, setShowEditWindow] = useState(false)
    const closeEditWindow = () => setShowEditWindow(false)

    //Used to set the event wanted to view in the viewing modal
    const handleEventClick = (event) => {
        setCurrentEvent(event);
    };

    //Reset current event being viewed to close the viewing modal
    const resetCurrentEvent = () => {
        setCurrentEvent({});
    };


    //Shows create event window when a date/time slot is clicked, this is passed to the CreateEvent window
    const handleSlotClick = (slot) => {
        setShowCreateWindow(true);
        setSlotInfo(slot);
    };

    //--------------------------CALLBACK FUNCTIONS TO GET DATA FROM OTHER COMPONENTS-------------------------//

    // Callback function to receive data from EventDetails component
    const handleEventData = (data) => {
        setNewEvent(prevData => ({
            ...prevData,
            id: prevData.id ? prevData.id : uuidv4(),
            start: data.start,
            end: data.end,
            title: data.title,
            data: {
                ...prevData.data, 
                attendees: data.attendees,
                location: data.location
            }
        }));
    };

    // Callback function to receive data from TextEditor component
    const handleMessageData = (data) => {
        setNewEvent(prevData => ({
            ...prevData,
            data: {
                ...prevData.data,
                HTMLMessage: data
            }
        }));
    };

    //Used to update the myEvents state when the save button in the create event modal/window is clicked
    const handleSaveEvent = () => {
        // Check if newEvent has start time, end time, and a title
        if (newEvent.start && newEvent.end && newEvent.title) {
            // Add newEvent to myEvents array
            setEvents(prevEvents => [...prevEvents, newEvent]);
            setShowCreateWindow(false);
            
            setNewEvent({
                start: new Date(), 
                end: new Date(), 
                title: '', 
                data: {}, 
            })

        } else {
            // If any of the required fields are missing, show an alert or handle it accordingly
            alert('Please fill in all required fields: Start Time, End Time, and Title');
        }
    };

    const handleEditEvent = (e) => {
        setEditEvent(e)
        setShowEditWindow(true)
    };

    const handUpdateEvent = () => {
        // Create a new event object with updated properties

        if (newEvent.start && newEvent.end && newEvent.title) {

            const updatedEvent = {
                start: new Date(newEvent.start), // Ensure correct format with milliseconds
                end: new Date(newEvent.end), // Ensure correct format with milliseconds
                title: newEvent.title,
                data: {
                    ...editEvent.data, // Preserve other properties in the data object
                    attendees: newEvent.data.attendees,
                    location: newEvent.data.location,
                    HTMLMessage: newEvent.data.HTMLMessage
                }
            };
        
            // Update the myEvents array with the updated event object
            const updatedEvents = myEvents.map(event => {
                if (event.id === editEvent.id) {
                    return updatedEvent; // Replace the existing event with the updated event
                } else {
                    return event; // Keep other events unchanged
                }
            });
            
            setEvents(updatedEvents); // Update the state with the updated events array
            closeEditWindow(); // Close the edit event window

            // Reset newEvent and editEvent state
            setNewEvent({});
            setEditEvent({});
        } else {
            alert('Please fill in all required fields: Start Time, End Time, and Title');
        }
    };

    const handleResize = (e) => {
        // Update the event with the given ID
        const updatedEvents = myEvents.map(event => {
            // If the event ID matches the ID from the resize event
            if (event.id === e.event.id) {
                // Update start and end times
                return {
                    ...event,
                    start: e.start,
                    end: e.end
                };
            }
            // If the event ID doesn't match, return the event unchanged
            return event;
        });
    
        // Update the state with the new events array
        setEvents(updatedEvents);
    };

    const handleDelete = () => {
        const updatedEvents = myEvents.filter(event => event.id !== currentEvent.id);
        setEvents(updatedEvents)
        setCurrentEvent({})
        
    };
       

    const printAll = () => {
        console.log(`New Event State:`, newEvent)
        console.log(`Current Event State:`, currentEvent)
        console.log(`Edit Event State:`, editEvent)
        console.log(`Current Event List:`, myEvents)
    }

    window.printAll = printAll

    return (
        <div>
            <DnDCalendar
                localizer={localizer}
                events={myEvents}
                onSelectEvent={handleEventClick}
                selectable={true}
                onSelectSlot={handleSlotClick}
                onEventResize={handleResize}
                resizable
                onEventDrop={handleResize}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100vh' }}
            />     

            <CreateEvent 
                show={showCreateWindow}
                handleClose={closeCreateWindow}
                newEvent={newEvent}
                slotInfo={slotInfo}
                handleEventData={handleEventData}
                handleMessageData={handleMessageData}
                handleSaveEvent={handleSaveEvent}
            />

            <ViewEvent 
                currentEvent={currentEvent} 
                onClose={resetCurrentEvent} 
                editEvent={handleEditEvent}
                deleteEvent={handleDelete}
            />

            <EditEvent
                show={showEditWindow}
                handleClose={closeEditWindow}
                event={editEvent}
                handleEventData={handleEventData}
                handleMessageData={handleMessageData}
                handleSaveEvent={handleEditEvent}
                handleUpdateEvent={handUpdateEvent}
            />     
        </div>
    );
};

export default BigCalendar;

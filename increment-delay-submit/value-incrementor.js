import React, { useState, useReducer, useEffect, useRef } from 'react';

import * as api from '../api/values';

const requiredValueActions = {
    INCREASE: 'INCREASE',
    DECREASE: 'DECREASE',
}

function requiredValueReducer(state, action) {
    switch (action.type) {
        case requiredValueActions.INCREASE:
            return { requiredValue: state.requiredValue + 1 };
        case requiredValueActions.DECREASE:
            return { requiredValue: state.requiredValue - 1 };
        default:
            throw new Error(); // TODO Define error
    }
}

function ValueIncrementor(props) {

    const [state, dispatchRequiredValueChange] = useReducer(
        requiredValueReducer,
        { requiredValue: props.requiredValue }
    );

    // Track the id returned from the setTimeout function so that it can be cancelled
    // if the user changes the value again within the timeout delay period.
    const [timeoutId, setTimeoutId] = useState(null);

    // Track whether this is the first update.  Only run useEffect code if the user
    // has changed the state.requiredValue (as opposed to first run).
    const firstUpdate = useRef(true);

    // requiredValue
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
        } else {
            setTimeoutId(setTimeout(() => api.addRequiredValue(props.id, state.requiredValue), 5000)); // TODO Move timeout ms to configuration
        }
    }, [state.requiredValue]);

    const handleChange = (requiredValueAction) => {
        // If an existing timeout is running then cancel this.
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        dispatchRequiredValueChange({ type: requiredValueAction });
    }

    return (
        <div>
            <h1>{props.name} (Id: {props.id})</h1>
            <h2>Actual Value</h2>
            <p>{props.actualValue}</p>
            <h2>Required Value</h2>
            <button type="button"
                className="btn btn-lg"
                onClick={() => handleChange(requiredValueActions.INCREASE)}>+ 1</button>
            <p>{state.requiredValue}</p>
            <button type="button"
                className="btn btn-lg"
                onClick={() => handleChange(requiredValueActions.DECREASE)}>- 1</button>
        </div>
    );
}

export default ValueIncrementor;
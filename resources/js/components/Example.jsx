import React from 'react';
import ReactDOM from 'react-dom';
import Pusher from 'pusher-js';

function Example() {

    Pusher.logToConsole = true;

    var pusher = new Pusher('f959c4bf7c6b75daca59', {
      cluster: 'eu'
    });

    var channel = pusher.subscribe('Notificate-channel');
    channel.bind('App\\Events\\show', function(data) {
    console.log(data)
    });

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example Component</div>

                        <div className="card-body">I'm an example component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Example;

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}

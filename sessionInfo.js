var SessionInfo = function () {
    var moment = require('moment');
    var sessions = [];
    var timezone;
    
    function init(dataFilePath, timeZone) {
        timezone = timeZone;
        getSessionsFromLocalFile(dataFilePath);
    }
    
    function getSessionsFromLocalFile(dataFilePath) {
        sessions = require(dataFilePath);
    }
    
    function getSessionBySpeaker(name) {
        for (var s in sessions) {
            if (sessions[s].speaker && sessions[s].speaker.toLowerCase() === name.toLowerCase())
                return sessions[s];
        }
    }
    
    function getSessionById(id) {
        for (var s in sessions) {
            if (sessions[s].id === id)
                return sessions[s];
        }
    }
    
    function getSessionByTime(time) {
        if (time === 'PRESENT_REF')
            time = moment().zone(timezone);
        else
            time = time.replace("T", "");
        
        for (var s in sessions) {
            var session = sessions[s];
            var sessionStartTime = moment(session.startTime, 'HH:mm A');
            var sessionEndTime = moment(session.endTime, 'HH:mm A');
            
            var queryTime = moment(time, 'HH:mm A');
            
            if (queryTime >= sessionStartTime && queryTime <= sessionEndTime)
                return session;
        }
    }
    
    function getLastSession() {
        return sessions[sessions.length - 1];
    }
    
    function getNextSession(id) {
        if (id === undefined || id === null) {
            return sessions[0];
        }
        
        for (var s in sessions) {
            if (sessions[s].id > id)
                return sessions[s];
        }
    }
    
    return {
        getNextSession: getNextSession,
        getSessionBySpeaker: getSessionBySpeaker,
        getSessionByTime: getSessionByTime,
        getLastSession: getLastSession,
        init: init
    }
}();

module.exports = SessionInfo;
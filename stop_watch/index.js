// Initial value of timer
const initialTime = {
    "hours": 0,
    "mins": 0,
    "secs": 0,
    "milli_secs": 0
}

// Inital Lap
let initialLap = 0

// Initial intervalId
let intervalId = -1;

// Track stopwatch running status
let isActive = false

// Initialize presentTime with initial time
let presentTime = {...initialTime}

// Document element selection
const body = document.querySelector("body")
const playBtn = document.getElementById("play")
const lapsBtn = document.getElementById("laps")
const resetBtn = document.getElementById("reset")
const timer = document.getElementById("timer")
const milli_secs_container = document.getElementById("millisec-container")
const playBtnIcon = playBtn.querySelector("i")
const lap_container = document.querySelector("#laps-container")
const lap_container_wrapper = document.querySelector("#laps-container-wrapper")
const controller = document.querySelector("#controller")

// Display the initial Timer value (HH:MM:SS) on the clock
timer.innerText = `${initialTime["hours"].toString().padStart(2, '0')}:${initialTime["mins"].toString().padStart(2, '0')}:${initialTime["secs"].toString().padStart(2, '0')}`

// Display the initial Timer MilliSecond value on the clock
milli_secs_container.innerText = initialTime["milli_secs"].toString().padStart(3, '0')

// ------------------------ //
// Functions
// ------------------------ //

// Return the required format HH:MM:SS:ms value, used for Laps snapshot 
function formattedTime(timeMap){
    return `${timeMap.hours.toString().padStart(2, '0')}:${timeMap.mins.toString().padStart(2, '0')}:${timeMap.secs.toString().padStart(2, '0')}:${timeMap.milli_secs.toString().padStart(3, '0')}`
}

// Sets the Timer value on clock based on the runtime value of elapsed Interval
function displayTimer({hours, mins, secs, milli_secs}){
    // Set HH:MM:SS part of timer on clock
    timer.innerText = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    
    // Sets milliSecond (SSS) part of timer
    milli_secs_container.innerText = milli_secs.toString().padStart(3, '0')
}

// Logic to update the timer on clock as it runs 
function updateTimer(){
    presentTime["milli_secs"] += 1

    if(presentTime["milli_secs"] > 999){
        presentTime["secs"] += 1
        presentTime["milli_secs"] = 0
        if (presentTime["secs"] > 59){
            presentTime["secs"] = 0
            presentTime["mins"] +=1
            if (presentTime["mins"] > 59){
                presentTime["hours"]+=1
                presentTime["mins"] = 0
            }
        }
    }
    displayTimer(presentTime)
}

// ------------------------ //
//    Controller Functionality
// ------------------------ //
function intervalStatus(intervalTimerInstance){
    // stop-watch is running and we want to stop it
    if(isActive){
        // Clears the timer using the reference intervalId
        clearInterval(intervalTimerInstance) 
        
        // Change pause icon to play
        playBtnIcon.classList.remove("fa-pause")
        playBtnIcon.classList.add("fa-play")
        
        // Disable Laps capturing button
        lapsBtn.setAttribute("disabled", true)

        //Change the boolean state to opposite value
        isActive = !isActive
    }  
    // stop-watch not started/paused want to start it
    else{
        // Start the timer
        intervalTimerInstance = setInterval(updateTimer)
        
        // Change play icon to pause
        playBtnIcon.classList.remove("fa-play")
        playBtnIcon.classList.add("fa-pause")

        // Activate the Laps and Reset button
        resetBtn.removeAttribute("disabled")
        lapsBtn.removeAttribute("disabled")

        // Change the boolean state to opposite value
        isActive = !isActive
    }

    // return the intervalId for future reference
    return intervalTimerInstance
}

// Set click event on play button
playBtn.addEventListener("click", ()=>{
    intervalId = intervalStatus(intervalId)
})

// ------------------------ //
//    Laps Functionality
// ------------------------ //
// Control Overflow of lap container
lap_container.style.maxHeight = `${controller.getBoundingClientRect().top - lap_container.getBoundingClientRect().top}px`;

function lapHandling(){
    // <div class="lap-detail"><span>1</span><span>20:20:20:203</span></div>
    const lap_detail_container = document.createElement("div")
    lap_detail_container.setAttribute("class", "lap-detail record")

    const lap_count_container = document.createElement("span")
    lap_count_container.textContent = `#${initialLap+=1}`

    const lap_time_container = document.createElement("span")
    lap_time_container.textContent = formattedTime(presentTime)

    lap_detail_container.appendChild(lap_count_container)
    lap_detail_container.appendChild(lap_time_container)

    lap_container_wrapper.appendChild(lap_detail_container)

    console.log(lap_container_wrapper.children)
}

lapsBtn.addEventListener("click", ()=>{
    lapHandling(presentTime)
    if(lap_container_wrapper.children.length === 2){
        lap_container_wrapper.classList.add("display")
    }
})

// ------------------------ //
//   Reset Functionality
// ------------------------ //
function resetAll(){
    // Handles the case when timer is running and reset is made
    if(isActive){
        clearInterval(intervalId)
    }

    // Initializes varaible to inital starting state
    isActive = false
    intervalId = -1
    initialLap = 0

    // Sets the timers HR:MM:SS to initial values
    timer.innerText = `${initialTime["hours"].toString().padStart(2, '0')}:${initialTime["mins"].toString().padStart(2, '0')}:${initialTime["secs"].toString().padStart(2, '0')}`

    // Sets MilliSecond timmer to initial value
    milli_secs_container.innerText = initialTime["milli_secs"].toString().padStart(3, '0')

    // Resets the presentTime to Initial time of all units to 0
    presentTime = {...initialTime}

    // Disables the Reset and Laps button
    lapsBtn.setAttribute("disabled", true)
    resetBtn.setAttribute("disabled", true)

    // Changes the PlayButton icon to initial play state
    if(playBtnIcon.classList.contains("fa-pause")){
        playBtnIcon.classList.remove("fa-pause")
        playBtnIcon.classList.add("fa-play")
    }

    // Remove all the recorded laps 
    const lapRecords = document.querySelectorAll(".lap-detail.record")
    if(lapRecords.length != 0){
        lapRecords.forEach(record => record.remove())
    }

    // Hides the Laps displaying table
    lap_container_wrapper.classList.remove("display")
}

// Adding click event to reset button
resetBtn.addEventListener("click", ()=>resetAll())

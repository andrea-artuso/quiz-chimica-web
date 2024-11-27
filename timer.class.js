class Timer {
    constructor(totalSeconds){
        this.secondsleft = totalSeconds
        this.overtime = 0

        this.startTimer()
    }

    static formatTime(seconds){
        let minutes = Math.floor(seconds / 60)
        let remainingSeconds = seconds % 60

        let formattedMinutes = String(minutes).padStart(2, '0')
        let formattedSeconds = String(remainingSeconds).padStart(2, '0')

        return `${formattedMinutes}:${formattedSeconds}`
    }

    startTimer(){
        localStorage.removeItem("startTime")
        localStorage.removeItem("endTime")
        this.isRunning = true
    
        let startTimestamp = Date.now()
        localStorage.setItem("startTime", startTimestamp)

        setInterval(() => {
            this.updateTimer(-1)
        }, 1000);
    }

    stopTimer(){
        this.isRunning = false

        let endTimestamp = Date.now()
        let startTimestamp = localStorage.getItem("startTime")

        let elapsedSeconds = Math.round((endTimestamp - startTimestamp)/1000)
        return elapsedSeconds
    }

    updateTimer(delta){
        if (!this.isRunning) return;
            
        if (this.secondsleft == 0){
            this.overtime += 1
            document.querySelector("#overtime").innerHTML = "+"+ this.constructor.formatTime(this.overtime)
        } else {
            this.secondsleft += delta
            document.querySelector("#timer").innerHTML = this.constructor.formatTime(this.secondsleft)
        }
    }
}
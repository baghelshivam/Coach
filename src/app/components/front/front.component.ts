import { Component } from '@angular/core';
import { Seats, Row } from 'src/app/Seats';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent {

  emptySeats: Seats[] = [ //array of rows mapped with empty seats
    { row: [] },
    { row: [] },
    { row: [] },
    { row: [12] },
    { row: [] },
    { row: [] },
    { row: [] },
    { row: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  ]
  rowSeats: Row[] = [  //row number with seat left
    { Seat: 7, rowNo: 1 },
    { Seat: 7, rowNo: 2 },
    { Seat: 7, rowNo: 3 },
    { Seat: 7, rowNo: 4 },
    { Seat: 7, rowNo: 5 },
    { Seat: 7, rowNo: 6 },
    { Seat: 7, rowNo: 7 },
    { Seat: 7, rowNo: 8 },
    { Seat: 7, rowNo: 9 },
    { Seat: 7, rowNo: 10 },
    { Seat: 7, rowNo: 11 },
    { Seat: 3, rowNo: 12 }
  ]

  numSeats: number = 0 //seats to book
  rowMap: number[] = [1, 2, 3, 4, 5, 6, 7] //map for row with 7 seats
  bookedSeat: number[] = []         //array containing seats which are booked
  name: string = "Book Seats"

  onClick() {

    if (this.emptySeats[this.numSeats].row.length != 0) { // if there is a row with exactly numSeats seats available
      
      let temp = this.emptySeats[this.numSeats].row[0];
      this.emptySeats[this.numSeats].row.splice(0, 1);    //deleting row from rows with numSeats seat
      this.emptySeats[0].row.push(temp);                  // pushing that row in rows with 0 seats
      
      this.bookedSeat = [];                               // initialize booked seats to empty
      for (let i = 1; i <= this.numSeats; i++) {
        if (temp == 12) {
          this.bookedSeat.push((temp - 1) * 7 + (3 - this.rowSeats[temp - 1].Seat) + i);
        } else {
          this.bookedSeat.push((temp - 1) * 7 + (7 - this.rowSeats[temp - 1].Seat) + i);
        }
      }
      this.rowSeats[temp - 1].Seat = 0;                   // all seats on that row are full so rem seats = 0
      
    } else if (this.emptySeats[this.numSeats].row.length == 0) { //there is no row with exactly numSeats seats

          let nextSeats = -1;
          for (let i = this.numSeats; i <= 7; i++) {          //finding next rows with minimum extra seats
            if (this.emptySeats[i].row.length != 0) {
              nextSeats = i;
              break;
            }
          }

          if (nextSeats != -1) {                              //if such row is present(a row with more empty seats than required) 

            let temp = this.emptySeats[nextSeats].row[0];
            let rem = nextSeats - this.numSeats;              //no. of empty seats left inside that row
            
            this.emptySeats[nextSeats].row.splice(0, 1);      //remove row from rows with nextSeats seats 
            this.emptySeats[rem].row.push(temp);              //put it with rows with rem seats
            this.emptySeats[rem].row.sort((a, b) => a - b);   //sort that rows such that rows with minimum index is at first

            this.bookedSeat = [];                             //store booked seats
            for (let i = 1; i <= this.numSeats; i++) {
              if (temp == 12) {                               //for last row with 3 seats
                 this.bookedSeat.push(((temp - 1) * 7) + (3 - this.rowSeats[temp - 1].Seat) + i);
              } else {                                      ``//for rows with 7 seats
                  this.bookedSeat.push(((temp - 1) * 7) + (7 - this.rowSeats[temp - 1].Seat) + i);
              }
            }
            this.rowSeats[temp - 1].Seat = rem;             //change the empty seats to rem seats
          
          } else {                                          //numSeats seats to be booked in multiple rows

              let minCost = Number.MAX_SAFE_INTEGER;  //cost a defined data for finding best starting row to fill
              let startRow = 13;                //best start row from where we start filling the seats

              for (let i = 0; i < 12; i++) {    //code for finding combination of rows such that all seats are near visually according to assumtpions
                  if (this.rowSeats[i].Seat > 0) {
                    let tempSeat = this.numSeats;
                    let cost = 0;
                    let j = i;
                    
                    while (tempSeat > 0 && j < 12) {
                      if (this.rowSeats[j].Seat > 0) {
                        tempSeat -= this.rowSeats[j].Seat;
                        cost += (j - i + 1);
                      }
                      j++;
                    }
                    
                    if ((cost < minCost) && (tempSeat <= 0)) {    //finding best starting row with minimum cost such that all seats are neaby
                      minCost = cost;
                      startRow = i;
                    }
                  }
              }
            
              let tempSeat = this.numSeats;             //seats left to be booked
              this.bookedSeat = [];                     //re intializing seats booked

              while (tempSeat > 0 && startRow < 12) {   //book untill all numSeats seats are booked or no seat left in coach 

                let temp = this.rowSeats[startRow].Seat;  //empty seats in the row which we are currently booking

                if (temp > 0) {                         //skipping rows with no seats left

                  let prevTempSeat = tempSeat;          //previous instance of seats left
                  tempSeat -= temp;                     //remaining seats to be booked

                  let ind = this.emptySeats[temp].row.indexOf(startRow + 1, 0);//find and delete row from its peers with same no. of seats left
                  if (ind > -1) {
                    this.emptySeats[temp].row.splice(ind, 1);
                  }

                  for (let i = 1; (i <= prevTempSeat) && (i <= temp); i++) {  //storing booked seat numbres
                    if (this.rowSeats[startRow].rowNo == 12) {
                      this.bookedSeat.push(((this.rowSeats[startRow].rowNo - 1) * 7) + (3 - temp) + i);
                    } else {
                      this.bookedSeat.push(((this.rowSeats[startRow].rowNo - 1) * 7) + (7 - temp) + i);
                    }
                  }

                  if (temp <= prevTempSeat) { // all seats are used in the current row so shifting it with row with 0 rows
                    this.rowSeats[startRow].Seat = 0;
                    this.emptySeats[0].row.push(startRow + 1);
                   } else { // some seats are remaining in the current row so shifting it with rows with remaining seats
                      this.rowSeats[startRow].Seat = temp - prevTempSeat;
                      this.emptySeats[temp - prevTempSeat].row.push(startRow + 1);
                      this.emptySeats[temp - prevTempSeat].row.sort((a, b) => a - b);
                  }
                }
                startRow++;         //traversing for next row with empty seats
            }
      }
    }

  }
}

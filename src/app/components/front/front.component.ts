// Assumptions:

// We are assuming that the coach starts filling from top to bottom in a given row and left to right order in rows.
// We define the near seats as. If for a given user there are some seats in row 3 and row 5  ( gap of 1 row ) which is near compared to seats in row 4 and row 7 ( gap of 2 rows ).
// We assume that all seats in one row are at the same distance respectively to a seat in another row irrespective of its column. e.g. a seat in row 4 is at the same distance for all seats in row 7.
// If the user inputs more seats than available seats, seats will not get booked so users will not get in trouble.

// Database Structure:
// We are mapping the number of empty seats left to the array of rows.
// e.g. all rows with 3 seats left will be together in a sorted array where the first index of the array is the row with the minimum index.
// emptySeats[3].row is all rows with 3 seats left.
// We are also mapping row indexes with seats left. e.g. for a given row, we know how many seats are left open.
// rowSeats[8].Seat shows how many seats are left for row 9 (index 8). 
// for saving data in a database like MySQL below is the database structure. Assuming we have different users and it will generate a user id according to that.
// one user can have multiple seats but one seat can have only one user assigned to it (one-to-many relationship).
// We have one table named User and another table named Coach.
// The user table has 2 columns User_Id and User_name.
// User_Id is the primary key for the User table 
// The coach table has 2 columns Seat_No(Seat_Id) from 1 to 80 and User_Id assigned to it.
// Seat_No is the primary key for the Coach table and User_Id is the foreign key.


import { Component } from '@angular/core';
import { Seats, Row } from 'src/app/Seats';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css'],
})
export class FrontComponent {
  emptySeats: Seats[] = [
    //array of rows mapped with empty seats
    { row: [] },
    { row: [] },
    { row: [] },
    { row: [12] },
    { row: [] },
    { row: [] },
    { row: [] },
    { row: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  ];
  rowSeats: Row[] = [
    //row number with seat left
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
    { Seat: 3, rowNo: 12 },
  ];

  numSeats: number = 0;                                           //seats to book
  rowMap: number[] = [1, 2, 3, 4, 5, 6, 7];                       //map for row with 7 seats
  bookedSeat: number[] = [];                                      //array containing seats which are booked
  remainingSeats: number = 80;
  previousReamainingSeats: number = 80;
  name: string = 'Book Seats';

  seatBookingSubmit() {                                           //main function to book seats
    this.bookedSeat = [];
    this.previousReamainingSeats = this.remainingSeats;
    if(this.numSeats > this.remainingSeats){                      //if the seats to be booked are greater than available seats
      return;
    }

    // if(0 < this.numSeats && this.numSeats <8){
    if (this.emptySeats[this.numSeats].row.length != 0) {         // if there is a row with exactly numSeats seats available
      this.fixedSize();
    } else if (this.emptySeats[this.numSeats].row.length == 0) {  //there is no row with exactly numSeats seats
      let nextSeats = -1;

      for (let i = this.numSeats; i <= 7; i++) {                  //finding next rows with minimum extra seats
        if (this.emptySeats[i].row.length != 0) {
          nextSeats = i;
          break;
        }
      }
      if (nextSeats != -1) {                                      //if such row is present(a row with more empty seats than required)
        this.moreSize(nextSeats);
      } else {                                                    //numSeats seats to be booked in multiple rows
        let startRow = this.rowSeats.length + 1;                  //best start row from where we start filling the seats

        startRow = this.bestRows(startRow);
        this.multipleRows(startRow);
      }
    }
    this.remainingSeats -= this.numSeats;
    // }
  }
  //functions

  fixedSize() {
    let temp = this.emptySeats[this.numSeats].row[0];
    this.emptySeats[this.numSeats].row.splice(0, 1);              //deleting row from rows with numSeats seat
    this.emptySeats[0].row.push(temp);                            // pushing that row in rows with 0 seats
    this.totalBookedSeats(temp);
    this.rowSeats[temp - 1].Seat = 0;                             // all seats on that row are full so rem seats = 0
  }

  moreSize(nextSeats: number) {
    let temp = this.emptySeats[nextSeats].row[0];
    let rem = nextSeats - this.numSeats;                          //no. of empty seats left inside that row

    this.emptySeats[nextSeats].row.splice(0, 1);                  //remove row from rows with nextSeats seats
    this.emptySeats[rem].row.push(temp);                          //put it with rows with rem seats
    this.emptySeats[rem].row.sort((a, b) => a - b);               //sort that rows such that rows with minimum index is at first
    this.totalBookedSeats(temp);
    this.rowSeats[temp - 1].Seat = rem;                           //change the empty seats to rem seats
  }

  bestRows(startRow: number) {
    let minCost = Number.MAX_SAFE_INTEGER;                        //cost a defined data for finding best starting row to fill

    for (let i = 0; i < 12; i++) {                                //code for finding combination of rows such that all seats are near visually according to assumtpions
      if (this.rowSeats[i].Seat > 0) {
        let tempSeat = this.numSeats;
        let cost = 0;
        let j = i;
        while (tempSeat > 0 && j < 12) {
          if (this.rowSeats[j].Seat > 0) {
            tempSeat -= this.rowSeats[j].Seat;
            cost += j - i + 1;
          }
          j++;
        }
        if (cost < minCost && tempSeat <= 0) {                    //finding best starting row with minimum cost such that all seats are neaby
          minCost = cost;
          startRow = i;
        }
      }
    }
    return startRow;
  }
  
  totalBookedSeats(temp: number) {
    for (let i = 1; i <= this.numSeats; i++) {
      if (temp == 12) {
        this.bookedSeat.push(
          (temp - 1) * 7 + (3 - this.rowSeats[temp - 1].Seat) + i
        );
      } else {
        this.bookedSeat.push(
          (temp - 1) * 7 + (7 - this.rowSeats[temp - 1].Seat) + i
        );
      }
    }
  }

  multipleRows(startRow: number) {
    let tempSeat = this.numSeats;                                 //seats left to be booked

    while (tempSeat > 0 && startRow < 12) {                       //book untill all numSeats seats are booked or no seat left in coach
      let temp = this.rowSeats[startRow].Seat;                    //empty seats in the row which we are currently booking

      if (temp > 0) {                                             //skipping rows with no seats left
        let prevTempSeat = tempSeat;                              //previous instance of seats left
        tempSeat -= temp;                                         //remaining seats to be booked
        let ind = this.emptySeats[temp].row.indexOf(startRow + 1, 0); //find and delete row from its peers with same no. of seats left

        if (ind > -1) {
          this.emptySeats[temp].row.splice(ind, 1);
        }
        for (let i = 1; i <= prevTempSeat && i <= temp; i++) {    //storing booked seat numbres for multiple numbers
          if (this.rowSeats[startRow].rowNo == 12) {
            this.bookedSeat.push(
              (this.rowSeats[startRow].rowNo - 1) * 7 + (3 - temp) + i
            );
          } else {
            this.bookedSeat.push(
              (this.rowSeats[startRow].rowNo - 1) * 7 + (7 - temp) + i
            );
          }
        }

        if (temp <= prevTempSeat) {                               //all seats are used in the current row so shifting it with row with 0 rows
          this.rowSeats[startRow].Seat = 0;
          this.emptySeats[0].row.push(startRow + 1);
        } else {                                                  // some seats are remaining in the current row so shifting it with rows with remaining seats
          this.rowSeats[startRow].Seat = temp - prevTempSeat;
          this.emptySeats[temp - prevTempSeat].row.push(startRow + 1);
          this.emptySeats[temp - prevTempSeat].row.sort((a, b) => a - b);
        }
      }
      startRow++;                                                 //traversing for next row with empty seats
    }
  }
}

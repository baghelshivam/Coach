# Coach
This project is deployed at [Coach_link](https://creative-kheer-d72e07.netlify.app/).

## Submission Sheet 
The assumptions and details about database are listed at [Report and Assumptions](https://docs.google.com/document/d/1lA_yybudL0RFEamjMgNhs8d9MI82UZbQB5xYK6BiLMA/edit?usp=sharing).

## Assumptions
We are assuming that the coach starts filling from top to bottom in a given row and left to right order in rows.


We define near seats as if for a given user there are some seats in row 3 and row 5  ( gap of 1 row ) which is near compared to seats in row 4 and row 7 ( gap of 2 rows ).

We assume that all seats in one row are at the same distance respectively to a seat in another row irrespective of its column. e.g. a seat in row 4 is at the same distance to all seats in row 7.

If the user inputs more seats than available seats, seats will not get booked so users will not get in trouble.

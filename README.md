# Restaurant

This is a React-based Restaurant web application that has the following features

- User is able to create an account and log in. 

- Implement 3 roles with different permission levels
   
   * Regular User: Can rate and leave a comment for a restaurant
   
   * Owner: Can create restaurants and reply to comments about owned restaurants
   
   * Admin: Can edit/delete all users, restaurants, comments, and reviews

- Reviews should have:

   * A 5 star based rating

   * Date of the visit

   * Comment 

- When a Regular User logs in, they will see a Restaurant List ordered by Average Rating

- When an Owner logs in, they will see a Restaurant List - only the ones owned by them, and the reviews pending reply

- Owners can reply to each review once

- Restaurants detailed view should have:

   * The overall average rating

   * The highest rated review

   * The lowest rated review

   * Last reviews with rate, comment, and reply

- Restaurant List can be filtered by Rating

- Used REST API. Made it possible to perform all user actions via the API, including authentication. 

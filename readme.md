run npm start

http://localhost:5000/

<h1>Node Emailer</h1>
<p>Send a post to /send with the data:</p>
<p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
</p>
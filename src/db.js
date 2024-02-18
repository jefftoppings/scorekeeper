// db.js

const { createClient } = require("@supabase/supabase-js");
const { supabaseApiUrl, supabaseApiKey } = require("./keys");

// Replace with your Supabase credentials
// todo
const supabaseUrl = supabaseApiUrl;
const supabaseKey = supabaseApiKey;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

// example of using this in a File:
// // src/routes/mainRoutes.js

// const express = require('express');
// const router = express.Router();
// const supabase = require('../db'); // Path to your db.js file

// router.get('/', async (req, res) => {
//   try {
//     // Example query to retrieve data from a table
//     const { data, error } = await supabase
//       .from('your_table_name')
//       .select('*');

//     if (error) {
//       throw error;
//     }

//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching data from Supabase:', error.message);
//     res.status(500).send('Internal Server Error');
//   }
// });

// module.exports = router;

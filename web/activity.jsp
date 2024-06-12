<!DOCTYPE html>
<html>
<head>
    <title>Activity Suggestion</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #FEF5E7;
        }
        .container {
            width: 80%;
            max-width: 1200px;
            margin: auto;
            background: #89927b;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            border-radius: 10px;
        }
        .left-section, .right-section {
            width: 48%;
        }
        h1 {
            font-size: 2em;
            margin-bottom: 0.5em;
            color: white;
        }
        h3 {
            margin-bottom: 1em;
            color: #666;
        }
        h2 {
            text-align: center;
            margin-bottom: 1em;
            color: white;
        }
        label {
            font-weight: bold;
            color: white;
        }
        select, input[type="number"], input[type="radio"] {
            width: 100%;
            padding: 0.5em;
            margin-bottom: 1em;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .radio-group {
            display: flex;
            align-items: center;
            margin-bottom: 1em;
        }
        .radio-group input[type="radio"] {
            width: auto;
            margin-right: 0.5em;
        }
        input[type="submit"] {
            width: 100%;
            padding: 1em;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
        }
        input[type="submit"]:hover {
            background-color: #0056b3;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1em;
        }
        th, td {
            padding: 1em;
            border: 1px solid #ccc;
            text-align: left;
        }
        th {
            background-color: #f8f8f8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-section">
            <form action="suggestion" method="post">
                <h2>Personalize Your Experience!</h2>
                <label for="type">Type of Activity</label>
                <select id="type" name="type">
                    <option value="">-Random-</option>
                    <option value="education">Education</option>
                    <option value="recreational">Recreational</option>
                    <option value="social">Social</option>
                    <option value="charity">Charity</option>
                    <option value="cooking">Cooking</option>
                    <option value="relaxation">Relaxation</option>
                    <option value="music">Music</option>
                    <option value="diy">DIY (Do It Yourself)</option>
                    <option value="busywork">Busywork</option>
                </select>

                <label for="Pnum">Number of Participants</label>
                <input type="number" placeholder="Participant No." name="Pnum" id="Pnum">

                <label for="price">Price</label>
                <div class="radio-group">
                    <input type="radio" id="free" name="price" value="0">
                    <label for="free">Free</label>
                </div>
                <div class="radio-group">
                    <input type="radio" id="paid" name="price" value="0.1">
                    <label for="paid">Paid</label>
                </div>
                
                <input class="button" type="submit" value="Generate Suggestion">
            </form>
        </div>
        <div class="right-section">
            <h1>Find Your Next Adventure</h1>
            <h3>Explore Our Fun Suggestion Activity!</h3>
            <% String suggestion = (String) request.getAttribute("suggestion");
            if (suggestion != null) { %>
                <h4>Suggested Activity:</h4>
                <%= suggestion %>
            <% } %>
        </div>
    </div>
</body>
</html>

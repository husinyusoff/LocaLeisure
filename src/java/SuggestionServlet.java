import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONException;
import org.json.JSONObject;

@WebServlet("/suggestion")
public class SuggestionServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get the selected type from the user
        String selectedType = request.getParameter("type");
        String participantNum = request.getParameter("Pnum");
        int pnum = 0;
        if (participantNum != null && !participantNum.isEmpty()) {
            pnum = Integer.parseInt(participantNum);
        }
        String paidValue = request.getParameter("price");
        double value = 0.0;
        if (paidValue != null && !paidValue.isEmpty()) {
            value = Double.parseDouble(paidValue);
        }

        // Build the API URL
        StringBuilder apiUrl = new StringBuilder("http://bored.api.lewagon.com/api/activity/");
        boolean firstParam = true;
        if (selectedType != null && !selectedType.isEmpty()) {
            apiUrl.append(firstParam ? "?" : "&").append("type=").append(selectedType);
            firstParam = false;
        }
        if (pnum > 0) {
            apiUrl.append(firstParam ? "?" : "&").append("participants=").append(pnum);
            firstParam = false;
        }
        if (value == 0.0) {
            apiUrl.append(firstParam ? "?" : "&").append("price=").append(value);
        }

        // Send a GET request to the Bored API
        HttpURLConnection connection = null;
        URL url = new URL(apiUrl.toString());
        boolean redirect = true;

        while (redirect) {
            connection = (HttpURLConnection) url.openConnection();
            connection.setInstanceFollowRedirects(false);
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_MOVED_PERM || responseCode == HttpURLConnection.HTTP_MOVED_TEMP) {
                String location = connection.getHeaderField("Location");
                url = new URL(location);
            } else {
                redirect = false;
            }
        }

        // Check the response code
        int responseCode = connection.getResponseCode();
        if (responseCode != 200) {
            request.setAttribute("suggestion", "<p>Error: Unable to fetch the activity from the API. HTTP Response Code: " + responseCode + "</p>");
            request.getRequestDispatcher("activity.jsp").forward(request, response);
            return;
        }

        // Read the response from the API
        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        StringBuilder responseBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            responseBuilder.append(line);
        }
        reader.close();

        // Log the API response for debugging
        String apiResponse = responseBuilder.toString();
        System.out.println("API Response: " + apiResponse);

        // Parse the JSON response
        JSONObject jsonObject;
        try {
            jsonObject = new JSONObject(apiResponse);
        } catch (JSONException e) {
            // Handle non-JSON response gracefully
            System.err.println("Error parsing JSON: " + e.getMessage());
            request.setAttribute("suggestion", "<p>Error: The response from the API is not in the expected format.</p>");
            request.getRequestDispatcher("activity.jsp").forward(request, response);
            return;
        }

        String activity = "";
        String type = "";
        int participants = 0;
        double price = 0.0;
        double accessibility = 0.0;
        try {
            activity = jsonObject.getString("activity");
            type = jsonObject.getString("type");
            participants = jsonObject.getInt("participants");
            price = jsonObject.getDouble("price");
            accessibility = jsonObject.getDouble("accessibility");
        } catch (JSONException e) {
            activity = null; // Set activity to null if the field is not found
            System.err.println("Error parsing JSON: " + e.getMessage());
        }

        // Convert price and accessibility to user-friendly formats
        String priceLabel = getPriceLabel(price);
        String accessibilityLabel = getAccessibilityLabel(accessibility);

        // Construct the suggestion as an HTML table
        String suggestion;
        if (activity == null) {
            suggestion = "<p>Sorry, the activity does not exist</p>";
        } else {
            StringBuilder suggestionBuilder = new StringBuilder();
            suggestionBuilder.append("<table>");
            suggestionBuilder.append("<tr><th>Activity</th><td>").append(activity).append("</td></tr>");
            suggestionBuilder.append("<tr><th>Type</th><td>").append(type).append("</td></tr>");
            suggestionBuilder.append("<tr><th>Participants</th><td>").append(participants).append("</td></tr>");
            suggestionBuilder.append("<tr><th>Price</th><td>").append(priceLabel).append("</td></tr>");
            suggestionBuilder.append("<tr><th>Accessibility</th><td>").append(accessibilityLabel).append("</td></tr>");
            suggestionBuilder.append("</table>");
            suggestion = suggestionBuilder.toString();
        }

        // Set the suggestion as an attribute in the request
        request.setAttribute("suggestion", suggestion);

        // Forward the request to the activity.jsp page
        request.getRequestDispatcher("activity.jsp").forward(request, response);
    }

    private String getPriceLabel(double price) {
        if (price == 0.0) {
            return "Free";
        } else if (price <= 0.3) {
            return "$ (Affordable)";
        } else if (price <= 0.6) {
            return "$$ (Economical)";
        } else {
            return "$$$ (Expensive)";
        }
    }

    private String getAccessibilityLabel(double accessibility) {
        if (accessibility == 0.0) {
            return "Most Accessible";
        } else if (accessibility <= 0.3) {
            return "Accessible";
        } else if (accessibility <= 0.6) {
            return "Moderately Accessible";
        } else {
            return "Least Accessible";
        }
    }
}

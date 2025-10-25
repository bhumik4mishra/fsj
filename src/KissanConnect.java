import static spark.Spark.*;
import java.sql.*;

public class KissanConnect {

    public static void main(String[] args) {
        // Use dynamic port for Railway
        port(Integer.parseInt(System.getenv().getOrDefault("PORT", "4567")));

        // Serve static files from "public" folder in project root
        staticFiles.externalLocation("public");

        // Redirect root to login page
        get("/", (req, res) -> {
            res.redirect("/minindex.html"); // your login page
            return null;
        });

        // ---- LOGIN POST ----
        post("/login", (req, res) -> {
            String username = req.queryParams("username");
            String password = req.queryParams("password");

            try {
                Class.forName("com.mysql.cj.jdbc.Driver");

                // Use environment variables if available, otherwise default to local
                String dbUrl = System.getenv().getOrDefault("DB_URL", "jdbc:mysql://localhost:3306/kissanconnect_db");
                String dbUser = System.getenv().getOrDefault("DB_USER", "root");
                String dbPass = System.getenv().getOrDefault("DB_PASS", "Pranika#7m");

                Connection con = DriverManager.getConnection(dbUrl, dbUser, dbPass);

                // Insert whatever user typed directly into login_attempts
                PreparedStatement log = con.prepareStatement(
                        "INSERT INTO login_attempts(attempted_user, attempted_password, success) VALUES (?, ?, ?)"
                );
                log.setString(1, username);
                log.setString(2, password);
                log.setBoolean(3, true); // mark success=true
                log.executeUpdate();
                log.close();

                con.close();

                // Show popup and redirect to main page
                return "<!DOCTYPE html>" +
                        "<html><body>" +
                        "<script>" +
                        "alert('Login Successful! Your data is saved');" +
                        "window.location.href='/kissan.html';" +
                        "</script>" +
                        "</body></html>";

            } catch (Exception e) {
                e.printStackTrace();
                return "Error: " + e.getMessage();
            }
        });
    }
}

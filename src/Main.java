

import java.sql.*;
public class Main{

    private static final String url="jdbc:mysql://localhost:3306/mydb";
    private static final String username="root";
    private static final String password="Pranika#7m";







    public static void main(String[] args){
try {
    Class.forName("com.mysql.cj.jdbc.Driver");
}catch (ClassNotFoundException e){
    System.out.println(e.getMessage());
}


        try {
           Connection connection =DriverManager.getConnection(url,username,password);
Statement statement = connection.createStatement();
            String query= String.format("insert into student(name,age,marks,id)values(%s,%o,%f,%o)","bhumi",18,99,938);
           int rowsAffected= statement.executeUpdate(query);
            if(rowsAffected>0){
                System.out.println("data inserted successfully");
            }
        }catch (SQLException e){
            System.out.println(e.getMessage());
        }








    }







}
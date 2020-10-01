package no.autopacker.filedeliveryapi.init;

import no.autopacker.filedeliveryapi.FileDeliveryApiApplication;
import org.apache.commons.io.IOUtils;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

@Order(value = 1)
@Component
public class CreateDB implements CommandLineRunner {
	@Autowired
	private Environment env;

	@Override
	public void run(String... args) throws Exception {
		final String DRIVER = "com.mysql.cj.jdbc.Driver";
		String dbUrlRaw = env.getProperty("spring.datasource.url");
		// Get the jdbc url from properties without the database name
		final String DB_URL = dbUrlRaw.substring(0, dbUrlRaw.lastIndexOf("/"));
		final String DB_NAME = env.getProperty("spring.datasource.url").replace(DB_URL, "");
		final String DB_USER = env.getProperty("spring.datasource.username");
		final String DB_PW = env.getProperty("spring.datasource.password");

		String importedDb = IOUtils.toString(getClass().getClassLoader().getResourceAsStream("ap_fs.sql"), StandardCharsets.UTF_8);

		if (importedDb != null) {
			Connection con = DriverManager.getConnection(DB_URL, DB_USER, DB_PW);

			// Enter the mysql global space (without selecting table) and create a table
			Statement stmt = con.createStatement();
//			stmt.execute("CREATE DATABASE IF NOT EXISTS ap_fs");
//			stmt.close();
//			con.close();

			// Enter mysql with a database and execute query from .sql file
			con = DriverManager.getConnection(dbUrlRaw, DB_USER, DB_PW);
			stmt = con.createStatement();

			// It's not possible to import all tables at once, so it's split up with hashtag as seperator
			for (String q : importedDb.split("#")) {
				stmt.addBatch(q);
			}

			stmt.executeBatch();
			stmt.close();
			con.close();

			LoggerFactory.getLogger(FileDeliveryApiApplication.class).info("Database has been imported.");
		}
	}
}

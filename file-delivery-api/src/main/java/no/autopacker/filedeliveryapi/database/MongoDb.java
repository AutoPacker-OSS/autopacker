package no.autopacker.filedeliveryapi.database;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.*;
import com.mongodb.client.*;
import no.autopacker.filedeliveryapi.config.AppConfig;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static com.mongodb.client.model.Filters.*;

@Repository
public class MongoDb {

    private final MongoCollection<Document> configCollection;

    @Autowired
    public MongoDb(AppConfig appConfig) {
        // Config
        System.out.println("PROPERTY: " + appConfig.getFdapiMongoUrl());
        MongoClientURI uri = new MongoClientURI(appConfig.getFdapiMongoUrl());
        MongoClient cli = new MongoClient(uri);
        MongoDatabase database = cli.getDatabase("apConfig");
        configCollection = database.getCollection("configParams");
        System.out.println(findByModuleId(2));
    }

    public boolean save(long moduleId, String jsonString) {
        boolean isSaved;
        ObjectMapper mapper = new ObjectMapper();

        try {
            Map<String, Object> map = mapper.readValue(jsonString, HashMap.class);
            map.put("module_id", moduleId);
            configCollection.insertOne(new Document(map));
            isSaved = true;
        } catch (IOException e) {
            isSaved = false;
        }

        return isSaved;
    }

    public boolean deleteByModuleId(long moduleId) {
        Document configParams = configCollection.find(eq("module_id", moduleId)).first();

        if (configParams != null) {
            configCollection.deleteOne(configParams);
        }

        return true;
    }

    public Document findByModuleId(long moduleId) {
        return configCollection.find(eq("module_id", moduleId)).first();
    }
}

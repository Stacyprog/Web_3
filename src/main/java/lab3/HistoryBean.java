package lab3;

import javax.ejb.EJB;
import java.util.LinkedList;

public class HistoryBean {

    @EJB
    private HistoryServiceBean service;
    private String session;

    private LinkedList<Query> queries = new LinkedList<>();

    public LinkedList<Query> getQueries() {
        return queries;
    }

    public void addQuery(Query query) {
        queries.addFirst(query);

        service.addQuery(new QueryEntity(session, query.getX(), query.getY(), query.getR(), query.isResult(),
                query.getCreated(), query.getElapsed()));
    }

    public void setSession(String session) {
        this.session = session;
    }
}

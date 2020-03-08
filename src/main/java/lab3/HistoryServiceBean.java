package lab3;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

@Stateless
@Transactional
public class HistoryServiceBean {

    @PersistenceContext(unitName = "default")
    private EntityManager entityManager;

    public void addQuery(QueryEntity queryEntity) {
        entityManager.persist(queryEntity);
    }
}

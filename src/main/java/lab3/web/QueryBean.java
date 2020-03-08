package lab3.web;

import lab3.HistoryBean;
import lab3.Query;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.ValidatorException;
import javax.faces.webapp.FacesServlet;
import javax.servlet.ServletRequest;
import java.util.Date;
import java.util.Iterator;

public class QueryBean {

    private static final int[] AVAILABLE_XES = new int[] {-4, -3, -2, -1, 0, 1, 2, 3, 4};
    private static final double MIN_AVAILABLE_Y = -5;
    private static final double MAX_AVAILABLE_Y = 5;
    private static final double MIN_AVAILABLE_R = 0.1;
    private static final double AVAILABLE_R_STEP = 0.1;
    private static final double MAX_AVAILABLE_R = 3;

    private HistoryBean historyBean;
    private ServletRequest request;

    private Double x, y, r;

    public String getHistoryJson() {
        StringBuilder builder = new StringBuilder("[");

        for (Iterator<Query> it = historyBean.getQueries().descendingIterator(); it.hasNext(); ) {
            Query query = it.next();

            builder
                    .append("{\"x\": ").append(query.getX())
                    .append(", \"y\": ").append(query.getY())
                    .append(", \"r\": ").append(query.getR())
                    .append(", \"result\": ").append(query.isResult())
                    .append("},");
        }

        builder.setCharAt(builder.length() - 1, ']');
        return builder.toString();
    }

    public void yValidator(FacesContext context, UIComponent component, Object value) {
        if (value == null) {
            return;
        }

        try {
            double y = Double.parseDouble(value.toString());

            if (y == MIN_AVAILABLE_Y || y == MAX_AVAILABLE_Y) {
                String msg = (String) component.getAttributes().getOrDefault("validatorMessage",
                        "Y must be in (" + MIN_AVAILABLE_Y + ", " + MAX_AVAILABLE_Y + ")");

                throw new ValidatorException(new FacesMessage(FacesMessage.SEVERITY_ERROR, msg, msg));
            }
        } catch (NumberFormatException e) {
            String msg = (String) component.getAttributes().getOrDefault("converterMessage", "Y must be a number");

            throw new ValidatorException(new FacesMessage(FacesMessage.SEVERITY_ERROR, msg, msg), e);
        }
    }

    public void checkAction() {
        if (x == null || y == null || r == null) {
            return;
        }

        boolean bad = false;
        if (x < AVAILABLE_XES[0] || x > AVAILABLE_XES[AVAILABLE_XES.length - 1]) {
            FacesContext.getCurrentInstance().addMessage(null, new FacesMessage("X должен входить в границы [-4, 4]"));
            bad = true;
        }

        if (y <= MIN_AVAILABLE_Y || y >= MAX_AVAILABLE_Y) {
            FacesContext.getCurrentInstance().addMessage(null, new FacesMessage("Y должен входить в границы (-5, 5)"));
            bad = true;
        }

        if (bad) {
            return;
        }

        historyBean.addQuery(new Query(x, y, r, check(x, y, r), new Date(),
                (System.nanoTime() - (long) request.getAttribute("startTime")) / 1000000000.));
    }

    private static boolean check(double x, double y, double r) {
        return (x >= 0 && y <= 0 && x*x + y*y < r*r) ||
                (x <= 0 && y <= 0 && y >= -r - x) ||
                (x <= 0 && y >= 0 && x >= -r && y <= r / 2);
    }

    public void setHistoryBean(HistoryBean historyBean) {
        this.historyBean = historyBean;
    }

    public void setRequest(ServletRequest request) {
        this.request = request;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getR() {
        return r;
    }

    public void setR(Double r) {
        this.r = r;
    }

    public int[] getAvailableXes() {
        return AVAILABLE_XES;
    }

    public double getMinAvailableY() {
        return MIN_AVAILABLE_Y;
    }

    public double getMaxAvailableY() {
        return MAX_AVAILABLE_Y;
    }

    public double getMinAvailableR() {
        return MIN_AVAILABLE_R;
    }

    public double getAvailableRStep() {
        return AVAILABLE_R_STEP;
    }

    public double getMaxAvailableR() {
        return MAX_AVAILABLE_R;
    }
}

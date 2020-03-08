package lab3;

import java.util.Date;

public class Query {

    private final double x, y, r;
    private final boolean result;
    private final Date created;
    private final double elapsed;

    public Query(double x, double y, double r, boolean result, Date created, double elapsed) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.result = result;
        this.created = created;
        this.elapsed = elapsed;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getR() {
        return r;
    }

    public boolean isResult() {
        return result;
    }

    public Date getCreated() {
        return created;
    }

    public double getElapsed() {
        return elapsed;
    }
}

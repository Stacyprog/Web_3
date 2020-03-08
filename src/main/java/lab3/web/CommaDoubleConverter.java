package lab3.web;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.NumberConverter;
import java.util.Locale;

public class CommaDoubleConverter extends NumberConverter {

    public CommaDoubleConverter() {
        super.setLocale(Locale.ENGLISH);
        super.setMaxFractionDigits(10);
    }

    @Override
    public Number getAsObject(FacesContext facesContext, UIComponent uiComponent, String s) {
        return (Number) super.getAsObject(facesContext, uiComponent, s.replace(',', '.'));
    }
}

package com.exadel.etoolbox.querykit.core.models.qom.constraints;

import org.apache.commons.lang3.ClassUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public interface JunctionConstraint {

    ConstraintAdapter getConstraint1();

    ConstraintAdapter getConstraint2();

    String getType();

    default boolean isCascade() {
        return isCascade(false);
    }

    default boolean isCascade(boolean nested) {
        if (getConstraint1() == null || getConstraint2() == null) {
            return false;
        }
        boolean leftIsJunction = ClassUtils.isAssignable(getConstraint1().getClass(), JunctionConstraint.class);
        boolean leftFits = !leftIsJunction || getConstraint1().getClass().equals(getClass());
        boolean rightIsJunction = ClassUtils.isAssignable(getConstraint2().getClass(), JunctionConstraint.class);
        boolean rightFits = !rightIsJunction || getConstraint2().getClass().equals(getClass());

        return leftFits && rightFits && (leftIsJunction || rightIsJunction || nested);
    }

    default List<ConstraintAdapter> flatten() {
        List<ConstraintAdapter> result = new ArrayList<>();
        for (ConstraintAdapter item : Arrays.asList(getConstraint1(), getConstraint2())) {
            if (ClassUtils.isAssignable(item.getClass(), JunctionConstraint.class)
                    && ((JunctionConstraint) item).isCascade(true)) {
                List<ConstraintAdapter> addenda = ((JunctionConstraint) item).flatten();
                result.addAll(addenda);
            } else {
                result.add(item);
            }
        }
        return result;
    }
}
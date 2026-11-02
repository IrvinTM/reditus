package com.irvin.pos.utils;

import java.util.List;

/**
 * Money math for sales. All amounts are in cents.
 */
public final class SaleCalculator {

    private SaleCalculator() {
    }

    /** Amounts for one sale line. net + tax == total. */
    public record LineAmounts(long net, long tax, long total) {
    }

    public record SaleAmounts(long subtotal, long taxTotal, long discount, long total) {
    }

    /**
     * @param unitPrice          price per unit, including taxes when {@code priceIncludesTaxes}
     * @param taxPercent         sum of the product's tax percentages
     */
    public static LineAmounts line(long unitPrice, int quantity, boolean priceIncludesTaxes, int taxPercent) {
        if (unitPrice < 0) {
            throw new IllegalArgumentException("Price can't be negative.");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero.");
        }
        long gross = Math.multiplyExact(unitPrice, quantity);
        if (priceIncludesTaxes) {
            long net = divideRounded(gross * 100, 100 + taxPercent);
            return new LineAmounts(net, gross - net, gross);
        }
        long tax = divideRounded(gross * taxPercent, 100);
        return new LineAmounts(gross, tax, gross + tax);
    }

    /** Discount is applied to the total after taxes and can't exceed it. */
    public static SaleAmounts sale(List<LineAmounts> lines, long discount) {
        if (discount < 0) {
            throw new IllegalArgumentException("Discount can't be negative.");
        }
        long subtotal = 0;
        long taxTotal = 0;
        long gross = 0;
        for (LineAmounts line : lines) {
            subtotal += line.net();
            taxTotal += line.tax();
            gross += line.total();
        }
        if (discount > gross) {
            throw new IllegalArgumentException("Discount can't be greater than the sale total.");
        }
        return new SaleAmounts(subtotal, taxTotal, discount, gross - discount);
    }

    /**
     * Amount to give back when refunding {@code quantity} units of a line, sharing the sale discount proportionally.
     */
    public static long refund(long lineTotal, int lineQuantity, int quantity, long saleTotal, long saleDiscount) {
        long gross = saleTotal + saleDiscount;
        if (gross == 0) {
            return 0;
        }
        // lineTotal * quantity / lineQuantity * saleTotal / gross, rounded once
        return divideRounded(lineTotal * quantity * saleTotal, (long) lineQuantity * gross);
    }

    /** Integer division rounding half up, for non negative values. */
    static long divideRounded(long dividend, long divisor) {
        return (dividend + divisor / 2) / divisor;
    }
}

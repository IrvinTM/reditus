package com.irvin.pos.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.irvin.pos.utils.SaleCalculator.LineAmounts;
import com.irvin.pos.utils.SaleCalculator.SaleAmounts;

class SaleCalculatorTest {

    @Test
    void priceWithoutTaxesAddsTax() {
        LineAmounts line = SaleCalculator.line(1000, 3, false, 15);
        assertEquals(new LineAmounts(3000, 450, 3450), line);
    }

    @Test
    void priceWithTaxesExtractsTax() {
        // 1150 including 15% -> 1000 net + 150 tax
        LineAmounts line = SaleCalculator.line(1150, 2, true, 15);
        assertEquals(new LineAmounts(2000, 300, 2300), line);
    }

    @Test
    void taxIsRoundedHalfUp() {
        // 333 * 13% = 43.29 -> 43 ; 335 * 13% = 43.55 -> 44
        assertEquals(43, SaleCalculator.line(333, 1, false, 13).tax());
        assertEquals(44, SaleCalculator.line(335, 1, false, 13).tax());
    }

    @Test
    void noTaxes() {
        assertEquals(new LineAmounts(500, 0, 500), SaleCalculator.line(500, 1, true, 0));
        assertEquals(new LineAmounts(500, 0, 500), SaleCalculator.line(500, 1, false, 0));
    }

    @Test
    void invalidLines() {
        assertThrows(IllegalArgumentException.class, () -> SaleCalculator.line(100, 0, false, 0));
        assertThrows(IllegalArgumentException.class, () -> SaleCalculator.line(-1, 1, false, 0));
    }

    @Test
    void saleTotalsApplyDiscountAfterTaxes() {
        SaleAmounts sale = SaleCalculator.sale(List.of(
                SaleCalculator.line(1000, 1, false, 15),
                SaleCalculator.line(2000, 1, true, 0)), 450);
        assertEquals(new SaleAmounts(3000, 150, 450, 2700), sale);
    }

    @Test
    void discountCantExceedTotal() {
        List<LineAmounts> lines = List.of(SaleCalculator.line(100, 1, false, 0));
        assertThrows(IllegalArgumentException.class, () -> SaleCalculator.sale(lines, 101));
        assertThrows(IllegalArgumentException.class, () -> SaleCalculator.sale(lines, -1));
        assertEquals(0, SaleCalculator.sale(lines, 100).total());
    }

    @Test
    void refundSharesDiscount() {
        // line of 4 units totalling 4000, sale gross 5000 with 1000 discount -> total 4000
        assertEquals(800, SaleCalculator.refund(4000, 4, 1, 4000, 1000));
        assertEquals(4000, SaleCalculator.refund(4000, 4, 4, 5000, 0));
        assertEquals(0, SaleCalculator.refund(0, 1, 1, 0, 0));
    }
}

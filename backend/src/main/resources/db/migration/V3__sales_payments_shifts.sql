-- Sales computed by the server, payments, void/refund, shifts and cash movements,
-- and product stock locking.

-- products: optimistic lock version
ALTER TABLE product ADD COLUMN version bigint NOT NULL DEFAULT 0;

-- registers
ALTER TABLE cash_register ADD COLUMN name character varying(255);
UPDATE cash_register SET name = 'Caja ' || id WHERE name IS NULL;

-- shifts
CREATE TABLE shift (
    id bigint NOT NULL PRIMARY KEY,
    cash_register_id bigint NOT NULL REFERENCES cash_register (id),
    status character varying(255) NOT NULL,
    opened_by bigint REFERENCES user_accounts (id),
    opened_at timestamp(6) with time zone,
    opening_float bigint NOT NULL DEFAULT 0,
    closed_by bigint REFERENCES user_accounts (id),
    closed_at timestamp(6) with time zone,
    expected_cash bigint,
    counted_cash bigint,
    notes character varying(255)
);
CREATE SEQUENCE shift_seq START WITH 1 INCREMENT BY 50;
-- only one open shift per register
CREATE UNIQUE INDEX shift_one_open_per_register ON shift (cash_register_id) WHERE status = 'OPEN';

-- sales
ALTER TABLE sale ALTER COLUMN discount TYPE bigint;
ALTER TABLE sale
    ADD COLUMN status character varying(255),
    ADD COLUMN subtotal bigint NOT NULL DEFAULT 0,
    ADD COLUMN tax_total bigint NOT NULL DEFAULT 0,
    ADD COLUMN refunded_total bigint NOT NULL DEFAULT 0,
    ADD COLUMN shift_id bigint REFERENCES shift (id),
    ADD COLUMN cashier_id bigint REFERENCES user_accounts (id),
    ADD COLUMN voided_at timestamp(6) with time zone,
    ADD COLUMN voided_by bigint REFERENCES user_accounts (id),
    ADD COLUMN void_reason character varying(255);
-- sales made before this version: totals were sent by the client and taxes weren't stored
UPDATE sale SET status = 'COMPLETED', subtotal = total WHERE status IS NULL;

ALTER TABLE sale_item
    ADD COLUMN product_name character varying(255),
    ADD COLUMN price_includes_taxes boolean NOT NULL DEFAULT true,
    ADD COLUMN price_overridden boolean NOT NULL DEFAULT false,
    ADD COLUMN tax_amount bigint NOT NULL DEFAULT 0,
    ADD COLUMN line_total bigint NOT NULL DEFAULT 0,
    ADD COLUMN unit_cost bigint NOT NULL DEFAULT 0,
    ADD COLUMN refunded_quantity integer NOT NULL DEFAULT 0;
UPDATE sale_item si
SET product_name = p.name, line_total = si.price_at_sale * si.quantity, unit_cost = p.cost
FROM product p
WHERE p.id = si.product_id;

CREATE TABLE payment (
    id bigint NOT NULL PRIMARY KEY,
    sale_id bigint NOT NULL REFERENCES sale (id),
    method character varying(255),
    amount bigint NOT NULL DEFAULT 0,
    tendered bigint NOT NULL DEFAULT 0,
    change bigint NOT NULL DEFAULT 0
);
CREATE SEQUENCE payment_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE refund (
    id bigint NOT NULL PRIMARY KEY,
    sale_id bigint NOT NULL REFERENCES sale (id),
    date timestamp(6) with time zone,
    user_id bigint REFERENCES user_accounts (id),
    shift_id bigint REFERENCES shift (id),
    reason character varying(255),
    method character varying(255),
    amount bigint NOT NULL DEFAULT 0
);
CREATE SEQUENCE refund_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE refund_item (
    id bigint NOT NULL PRIMARY KEY,
    refund_id bigint NOT NULL REFERENCES refund (id),
    sale_item_id bigint NOT NULL REFERENCES sale_item (id),
    quantity integer NOT NULL DEFAULT 0,
    amount bigint NOT NULL DEFAULT 0
);
CREATE SEQUENCE refund_item_seq START WITH 1 INCREMENT BY 50;

-- cash movements: store the type by name and link them to shift, user and sale
ALTER TABLE transaction DROP CONSTRAINT IF EXISTS transaction_transaction_type_check;
ALTER TABLE transaction ALTER COLUMN transaction_type TYPE character varying(255)
    USING CASE transaction_type WHEN 0 THEN 'DEPOSIT' WHEN 1 THEN 'WITHDRAWAL' END;
ALTER TABLE transaction
    ADD COLUMN shift_id bigint REFERENCES shift (id),
    ADD COLUMN user_id bigint REFERENCES user_accounts (id),
    ADD COLUMN sale_id bigint REFERENCES sale (id),
    ADD COLUMN reason character varying(255);

CREATE INDEX sale_shift_id_idx ON sale (shift_id);
CREATE INDEX sale_date_idx ON sale (date);
CREATE INDEX transaction_shift_id_idx ON transaction (shift_id);
CREATE INDEX refund_sale_id_idx ON refund (sale_id);
CREATE INDEX refund_shift_id_idx ON refund (shift_id);

-- Schema as created by Hibernate ddl-auto=update before Flyway was adopted.
-- Existing databases are baselined at this version (spring.flyway.baseline-on-migrate), so this only runs on fresh installs.


CREATE TABLE public.cash_register (
    id bigint NOT NULL,
    balance bigint NOT NULL
);

CREATE SEQUENCE public.cash_register_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.category (
    id bigint NOT NULL,
    name character varying(255)
);

CREATE SEQUENCE public.category_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.company (
    id bigint NOT NULL,
    address character varying(255),
    email character varying(255),
    logo character varying(255),
    name character varying(255),
    phone_number character varying(255)
);

CREATE TABLE public.customer (
    id bigint NOT NULL,
    address character varying(255),
    email character varying(255),
    identification character varying(255),
    name character varying(255),
    phone_number character varying(255)
);

CREATE SEQUENCE public.customer_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.product (
    id bigint NOT NULL,
    allow_price_change boolean NOT NULL,
    available bigint NOT NULL,
    bar_code character varying(255),
    code character varying(255),
    cost bigint NOT NULL,
    description character varying(255),
    image character varying(255),
    is_active boolean NOT NULL,
    is_age_restricted boolean NOT NULL,
    measurement_unit character varying(255),
    name character varying(255),
    no_tax_included_price bigint NOT NULL,
    price_includes_taxes boolean NOT NULL,
    profit_margin bigint NOT NULL,
    sales_price bigint NOT NULL,
    tax_included_price bigint NOT NULL,
    stock_id bigint
);

CREATE TABLE public.product_categories (
    product_id bigint NOT NULL,
    category_id bigint NOT NULL
);

CREATE SEQUENCE public.product_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.product_taxes (
    product_id bigint NOT NULL,
    tax_id bigint NOT NULL
);

CREATE TABLE public.sale (
    id bigint NOT NULL,
    date timestamp(6) with time zone,
    discount integer NOT NULL,
    total bigint NOT NULL,
    cash_register_id bigint,
    customer bigint
);

CREATE TABLE public.sale_item (
    id bigint NOT NULL,
    price_at_sale bigint NOT NULL,
    quantity integer NOT NULL,
    product_id bigint,
    sale_id bigint
);

CREATE SEQUENCE public.sale_item_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.sale_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.stock (
    id bigint NOT NULL,
    total bigint NOT NULL,
    supplier_id bigint
);

CREATE SEQUENCE public.stock_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.supplier (
    id bigint NOT NULL,
    address character varying(255),
    email character varying(255),
    identification character varying(255),
    name character varying(255),
    phone_number character varying(255)
);

CREATE SEQUENCE public.supplier_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.tax (
    id bigint NOT NULL,
    code character varying(255),
    name character varying(255),
    percentage integer NOT NULL
);

CREATE SEQUENCE public.tax_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.transaction (
    id bigint NOT NULL,
    amount bigint NOT NULL,
    date timestamp(6) with time zone,
    transaction_type smallint,
    cash_register_id bigint,
    CONSTRAINT transaction_transaction_type_check CHECK (((transaction_type >= 0) AND (transaction_type <= 1)))
);

CREATE SEQUENCE public.transaction_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.user_accounts (
    id bigint NOT NULL,
    email character varying(255),
    enabled boolean NOT NULL,
    name character varying(255),
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    username character varying(255) NOT NULL
);

CREATE SEQUENCE public.user_accounts_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY public.cash_register
    ADD CONSTRAINT cash_register_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.sale_item
    ADD CONSTRAINT sale_item_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.supplier
    ADD CONSTRAINT supplier_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tax
    ADD CONSTRAINT tax_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT uklxwlgwuy2yrbye2vgs9w9x7mr UNIQUE (username);

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT user_accounts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.product_taxes
    ADD CONSTRAINT fk6a7padfhet2jf154ara1gjqmh FOREIGN KEY (product_id) REFERENCES public.product(id);

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT fk7cpkh0ajt3apyej1vtjsvbbeb FOREIGN KEY (category_id) REFERENCES public.category(id);

ALTER TABLE ONLY public.product
    ADD CONSTRAINT fk90w0j7y2y7chsmk4v4k02ekqf FOREIGN KEY (stock_id) REFERENCES public.stock(id);

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT fkalutw4hdntiu4a5l4wpw30lx8 FOREIGN KEY (cash_register_id) REFERENCES public.cash_register(id);

ALTER TABLE ONLY public.sale_item
    ADD CONSTRAINT fkar9qqr4n69xw1shum20oflleo FOREIGN KEY (sale_id) REFERENCES public.sale(id);

ALTER TABLE ONLY public.sale_item
    ADD CONSTRAINT fkih76x9f1o1asbp51c70hin53n FOREIGN KEY (product_id) REFERENCES public.product(id);

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT fkl2fbubw80ojtirp051oms6piu FOREIGN KEY (supplier_id) REFERENCES public.supplier(id);

ALTER TABLE ONLY public.product_taxes
    ADD CONSTRAINT fklmkt56gk2f3plgw3033pvjqkv FOREIGN KEY (tax_id) REFERENCES public.tax(id);

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT fkm3e74kum703q7xge7am08nrs9 FOREIGN KEY (customer) REFERENCES public.customer(id);

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT fkppc5s0f38pgb35a32dlgyhorc FOREIGN KEY (product_id) REFERENCES public.product(id);

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT fkqae5t69povp97q3cgo1xifv8s FOREIGN KEY (cash_register_id) REFERENCES public.cash_register(id);


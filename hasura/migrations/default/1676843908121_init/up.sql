SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.file (
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id text NOT NULL,
    status text NOT NULL,
    mimetype text NOT NULL,
    id integer NOT NULL
);
COMMENT ON TABLE public.file IS 'cache of upload files';
CREATE SEQUENCE public.file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.file_id_seq OWNED BY public.file.id;
CREATE TABLE public.nft (
    collection_address text NOT NULL,
    collection_name text NOT NULL,
    collection_symbol text NOT NULL,
    nft_description text NOT NULL,
    nft_external_url text NOT NULL,
    nft_raw_url text NOT NULL,
    nft_title text NOT NULL,
    token_id integer NOT NULL,
    user_id text NOT NULL,
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.nft_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.nft_id_seq OWNED BY public.nft.id;
CREATE TABLE public.operation (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    chain text NOT NULL,
    tx_id integer,
    tx_error text,
    user_id text NOT NULL,
    type text NOT NULL,
    actions jsonb,
    request_id integer
);
CREATE SEQUENCE public.operation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.operation_id_seq OWNED BY public.operation.id;
CREATE VIEW public.operation_public AS
 SELECT operation.id,
    operation.chain,
    operation.user_id
   FROM public.operation;
CREATE TABLE public.preference (
    user_id text NOT NULL,
    chain text,
    token_address text NOT NULL,
    display boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id integer NOT NULL,
    token_alias text,
    metadata text
);
CREATE SEQUENCE public.preference_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.preference_id_seq OWNED BY public.preference.id;
CREATE TABLE public.redpacket (
    id text NOT NULL,
    metadata jsonb NOT NULL,
    user_id text NOT NULL,
    creator jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    op_id integer NOT NULL,
    deposit jsonb,
    type text DEFAULT 'erc20'::text NOT NULL,
    validation_data jsonb DEFAULT jsonb_build_array() NOT NULL
);
COMMENT ON TABLE public.redpacket IS 'red packet data';
COMMENT ON COLUMN public.redpacket.user_id IS 'creator firebase user id';
CREATE TABLE public.redpacket_claim (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    redpacket_id text NOT NULL,
    claimer_id text NOT NULL,
    claimer jsonb,
    claimed text,
    creator_id text NOT NULL,
    op_id integer NOT NULL,
    req_id integer
);
CREATE SEQUENCE public.redpacket_claim2_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.redpacket_claim2_id_seq OWNED BY public.redpacket_claim.id;
CREATE VIEW public.redpacket_public AS
 SELECT redpacket.id,
    redpacket.metadata,
    redpacket.creator,
    redpacket.created_at,
    redpacket.op_id,
    redpacket.type
   FROM public.redpacket;
CREATE TABLE public.request (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    args jsonb,
    "to" text NOT NULL,
    gaslimit text,
    datahash text,
    value text,
    user_id text NOT NULL
);
CREATE SEQUENCE public.request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.request_id_seq OWNED BY public.request.id;
CREATE TABLE public.transaction (
    chain text NOT NULL,
    tx text NOT NULL,
    status text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    id integer NOT NULL,
    error text
);
CREATE SEQUENCE public.transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.transaction_id_seq OWNED BY public.transaction.id;
CREATE TABLE public."user" (
    email text NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    otp text,
    is_active boolean
);
COMMENT ON TABLE public."user" IS 'user table';
ALTER TABLE ONLY public.file ALTER COLUMN id SET DEFAULT nextval('public.file_id_seq'::regclass);
ALTER TABLE ONLY public.nft ALTER COLUMN id SET DEFAULT nextval('public.nft_id_seq'::regclass);
ALTER TABLE ONLY public.operation ALTER COLUMN id SET DEFAULT nextval('public.operation_id_seq'::regclass);
ALTER TABLE ONLY public.preference ALTER COLUMN id SET DEFAULT nextval('public.preference_id_seq'::regclass);
ALTER TABLE ONLY public.redpacket_claim ALTER COLUMN id SET DEFAULT nextval('public.redpacket_claim2_id_seq'::regclass);
ALTER TABLE ONLY public.request ALTER COLUMN id SET DEFAULT nextval('public.request_id_seq'::regclass);
ALTER TABLE ONLY public.transaction ALTER COLUMN id SET DEFAULT nextval('public.transaction_id_seq'::regclass);
ALTER TABLE ONLY public.file
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.nft
    ADD CONSTRAINT nft_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY public.operation
    ADD CONSTRAINT operation_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.preference
    ADD CONSTRAINT preference_id_key UNIQUE (id);
ALTER TABLE ONLY public.preference
    ADD CONSTRAINT preference_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.preference
    ADD CONSTRAINT preference_user_id_chain_token_address_key UNIQUE (user_id, chain, token_address);
ALTER TABLE ONLY public.redpacket_claim
    ADD CONSTRAINT redpacket_claim2_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.redpacket
    ADD CONSTRAINT redpacket_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
CREATE INDEX redpacket_claim2_claimer ON public.redpacket_claim USING btree (claimer_id);
CREATE INDEX redpacket_claim2_redpacket_id ON public.redpacket_claim USING btree (redpacket_id);
CREATE TRIGGER set_public_nft_updated_at BEFORE UPDATE ON public.nft FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_nft_updated_at ON public.nft IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_operation_updated_at BEFORE UPDATE ON public.operation FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_operation_updated_at ON public.operation IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_preference_updated_at BEFORE UPDATE ON public.preference FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_preference_updated_at ON public.preference IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_redpacket_claim2_updated_at BEFORE UPDATE ON public.redpacket_claim FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_redpacket_claim2_updated_at ON public.redpacket_claim IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_transaction_updated_at BEFORE UPDATE ON public.transaction FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_transaction_updated_at ON public.transaction IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_updated_at ON public."user" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.operation
    ADD CONSTRAINT operation_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.request(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.operation
    ADD CONSTRAINT operation_tx_id_fkey FOREIGN KEY (tx_id) REFERENCES public.transaction(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.redpacket_claim
    ADD CONSTRAINT redpacket_claim2_redpacket_id_fkey FOREIGN KEY (redpacket_id) REFERENCES public.redpacket(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.redpacket_claim
    ADD CONSTRAINT redpacket_claim_op_id_fkey FOREIGN KEY (op_id) REFERENCES public.operation(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.redpacket_claim
    ADD CONSTRAINT redpacket_claim_req_id_fkey FOREIGN KEY (req_id) REFERENCES public.request(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.redpacket
    ADD CONSTRAINT redpacket_op_id_fkey FOREIGN KEY (op_id) REFERENCES public.operation(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

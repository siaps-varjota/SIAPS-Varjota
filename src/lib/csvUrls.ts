export const CSV_URLS = {
  desenvolvimentoInfantil: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJk3K_1DtxtxvBx5UuRIbsl_OGzNA9AMMx3TbacImInVTl759ziDlxBK0nlwZg1J_iKxjktwvI5FaH/pub?gid=1142482515&single=true&output=csv",
  desenvolvimentoInfantilVacinas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJk3K_1DtxtxvBx5UuRIbsl_OGzNA9AMMx3TbacImInVTl759ziDlxBK0nlwZg1J_iKxjktwvI5FaH/pub?gid=1899832726&single=true&output=csv",
  gestacaoPuerperio: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSA7ZEnYITSAdJO8T5LvvnDewjPeqMT57kDv_oSeuFUUznKI3FQ5pGg2Ic34k4ZShbWtONP-dvJOABQ/pub?gid=1768767677&single=true&output=csv",
  hipertensao: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9k_e_-jlJbu3GvtHBhvCfuUbuC7l85MV_jjZRnbsd3lIqmoKF2pLhGl1JnSfziVXze5zkGCXdPb2n/pub?output=csv",
  diabetes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbfV1Kc6st6COoy-FxrbfnC_Ac3bxobCVY_-HXj0oyXNnVo7uVld2VVJh7gAhXAPGHXlZGutzjivjP/pub?gid=1534038569&single=true&output=csv",
  saudeMulher: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLX3B-1FNtn9BZVDseNGuRiPtUUtm13TTx_vI-quwscEMMsTVCp-NjL7b9YH4Cr4vgSI6jAH52M8mk/pub?gid=1711913800&single=true&output=csv",
  pessoaIdosa: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsrC8_qNUsaD2Yem4lAii-GtidlqdFcR65dSpjEKxv5u6Xwv2cH11_EkkYzxDFGYAB6d5fbcCN1mMo/pub?gid=1534038569&single=true&output=csv",
} as const;

export type TabKey = keyof typeof CSV_URLS;

export const TAB_LABELS: Record<TabKey, string> = {
  desenvolvimentoInfantil: "Desenv. Infantil",
  desenvolvimentoInfantilVacinas: "Desenv. Infantil (Vacinas)",
  gestacaoPuerperio: "Gestação e Puerpério",
  hipertensao: "Hipertensão",
  diabetes: "Diabetes",
  saudeMulher: "Saúde da Mulher",
  pessoaIdosa: "Pessoa Idosa",
};

export const TAB_ICONS: Record<TabKey, string> = {
  desenvolvimentoInfantil: "baby",
  desenvolvimentoInfantilVacinas: "syringe",
  gestacaoPuerperio: "person-standing",
  hipertensao: "activity",
  diabetes: "droplet",
  saudeMulher: "user-round",
  pessoaIdosa: "users",
};

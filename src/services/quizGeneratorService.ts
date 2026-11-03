import { QuizQuestion, QuizOption } from '../types/quiz';

export interface GenerateQuizRequest {
  manualTitle: string;
  manualContent: string;
  sectionId: string;
  stepId: string;
  questionCount?: number;
  focusPoint?: string;
}

// ホール業務のシチュエーション・ひっかけ・接客マインドナレッジベース
interface HallScenarioTemplate {
  keywords: string[];
  situation: string;
  question: string;
  correctAction: string;
  trapAction: string;
  passiveAction: string;
  rashAction: string;
  trapExplanation: string;
  explanation: string;
  mindsetFeedback: string;
}

const HALL_SCENARIOS: HallScenarioTemplate[] = [
  {
    keywords: ['出迎え', '入店', '挨拶', '3秒', 'アイコンタクト', '扉', 'ご案内'],
    situation: 'ピークタイムでフロアが忙しい最中、入り口の扉が開き、新しいお客様が来店された場面です。',
    question: 'ホールスタッフが取るべき最優先のファーストアプローチとして、最も適切なものはどれでしょうか？',
    correctAction: '作業の手を止め、お客様の目を見て3秒以内に明るい笑顔で「いらっしゃいませ！」と挨拶する',
    trapAction: '空席の有無を確認してから声をかけるため、パソコンや座席表を注視して確認を急ぐ',
    passiveAction: '他のお客様の注文対応中なので声は出さず、軽く目礼だけして案内担当が来るのを待つ',
    rashAction: '急いで片付けを終わらせようと、手元を見ながら大きめの声で挨拶だけ飛ばす',
    trapExplanation: '席の確認を優先して挨拶が遅れたり、作業しながら声だけ出すのは、歓迎されていない印象を与えてしまいます。',
    explanation: '第一印象は最初の3秒で決まります。作業を一時中断してでも、まずお客様の方を向いて笑顔で挨拶することが最優先です。',
    mindsetFeedback: '「自分はお客様に気づいており、心から歓迎している」という温かいメッセージを瞬時に届ける心構えが大切です。',
  },
  {
    keywords: ['満席', 'ウェイティング', '待', '名前', '時間'],
    situation: '満席のディナー時間帯に、予約なしのグループのお客様が来店され、席を希望された場面です。',
    question: 'お客様にお待ちいただく際のご案内対応として、最も適切で丁寧な行動はどれでしょうか？',
    correctAction: '「恐れ入ります。ただいま満席のため約15分程のお待ちとなりますが、お名前を伺えますか」と案内する',
    trapAction: '「現在満席となっておりますので、席が空き次第お呼びします。そちらでお待ちください」と告げる',
    passiveAction: '「満席なのでかなりお待ちいただくことになりますが、それでもよろしいでしょうか」と消極的に確認する',
    rashAction: 'ウェイティングボードを指差して「あちらにお名前を書いてお待ちいただけますか」とだけ伝える',
    trapExplanation: '見込み時間を伝えないとお客様は不安になり、またネガティブな言い方をすると歓迎されていないと感じてしまいます。',
    explanation: 'クッション言葉（恐れ入ります）を用い、具体的な見込み待ち時間を提示した上で、お名前の記帳をお願いするのが標準です。',
    mindsetFeedback: 'お待たせする時こそ、お客様の貴重な時間を尊重し、不安を解消する寄り添いの配慮が求められます。',
  },
  {
    keywords: ['配膳', '提供', '料理', '復唱', '熱い', 'トレイ', 'デシャップ'],
    situation: 'キッチンから出来上がったメイン料理をトレイに乗せて、お客様のテーブルへ運んだ場面です。',
    question: 'テーブルにお料理を提供する際の手順と声かけとして、最も好ましい作法はどれでしょうか？',
    correctAction: '「お待たせいたしました、〇〇でございます」と料理名を復唱し、右後方または空きスペースから丁寧に置く',
    trapAction: '会話の邪魔にならないよう配慮し、何も言わずにテーブルの端の空いているスペースへ素早く置く',
    passiveAction: '伝票を見ずに「〇〇をご注文されたのはどちら様でしょうか？」とテーブル全体に声かけして配膳する',
    rashAction: 'トレイをテーブルの上に直置きし、両手を使って一度に複数の皿を手早く並べる',
    trapExplanation: '良かれと思って無言で置くのはマナー違反です。また、伝票を確認せず誰の注文か大声で聞くのもスマートではありません。',
    explanation: '伝票で誰の注文かを把握した上で、料理名をハッキリ復唱して配膳します。熱い料理の場合は注意喚起も添えます。',
    mindsetFeedback: '料理の最後の仕上げはホールの丁寧なサーブです。料理人の想いとこだわりをお客様へ届けましょう。',
  },
  {
    keywords: ['バッシング', '下膳', '皿', '空いた', 'グラス', '片付け'],
    situation: 'お客様のテーブルでメインのお皿が空き、会話を楽しまれている様子が見られた場面です。',
    question: '中間バッシング（空いたお皿を下げる際）の対応として、最もスマートな所作はどれでしょうか？',
    correctAction: '会話の切れ目を見計らい、「失礼いたします、こちらのお皿お下げしてもよろしいでしょうか？」と伺う',
    trapAction: '早くテーブルを広くしてあげようと、会話中のお客様の背後から無言でサッと手を伸ばして皿を引く',
    passiveAction: '「早く帰れと急かされている」と誤解されないよう、お客様が退店するまで一切お皿には触れない',
    rashAction: '効率良く運ぶため、お客様の目の前でテーブル上のお皿を重ねてガタガタと音を立てて持ち上げる',
    trapExplanation: '無言で手を伸ばすとお客様を驚かせてしまいます。またテーブル上でお皿を重ねるのも安っぽい印象を与えます。',
    explanation: '必ず一声かけて承諾を得てから下げます。適切なお皿下げはテーブルを常に清潔に保ち、居心地を最大化します。',
    mindsetFeedback: '下膳は「片付け作業」ではなく、「次の一皿や会話をより心地よく楽しんでいただくための空間づくり」です。',
  },
  {
    keywords: ['こぼ', '水', 'ドリンク', 'グラス', '割', '服', '濡れ'],
    situation: '誤ってお冷のグラスを倒してしまい、テーブルの上とお客様のお洋服にお水がかかってしまった場面です。',
    question: 'スタッフが最優先で行うべき初期対応として、最も誠実で正しい行動はどれでしょうか？',
    correctAction: '「大変申し訳ございません！お怪我やお洋服は濡れておりませんでしょうか」とお気遣いし、清潔なおしぼりを複数手渡す',
    trapAction: '床が滑って他のお客様が転倒するのを防ぐため、床のモップがけを最優先で素早く行う',
    passiveAction: '自分のミスで動揺し、何も言えないまま裏のスタッフルームへリーダーを呼びに走る',
    rashAction: '「お客様の手が当たってしまって…」と状況の原因をその場で冷静に分析して説明する',
    trapExplanation: '店舗の床掃除や原因の分析ではなく、お客様の身体とお召し物の安否確認・ケアが何よりも最優先です。',
    explanation: 'まずは心からの謝罪と共にお客様の怪我や服の汚れを確認し、乾いた清潔なおしぼりをお渡ししてリーダーへ迅速に報告します。',
    mindsetFeedback: 'トラブル時にこそスタッフの人間性と店の品格が現れます。保身ではなく、お客様の心と身体を守る誠意を尽くしましょう。',
  },
  {
    keywords: ['遅い', '待た', '来ない', 'クレーム', '怒', '催促'],
    situation: 'お客様から「注文してからもう25分も経っているのに料理が来ない」と強い口調でお叱りを受けた場面です。',
    question: '新人の一次受け答えとして、お客様の信頼を回復するための最も適切な行動はどれでしょうか？',
    correctAction: '「お待たせしてしまい誠に申し訳ございません。至急キッチンの進行状況を確認してまいります」と伝えすぐ走らず確認する',
    trapAction: '「ただいまディナーピークでキッチンが大変混み合っておりますので、もう少々お待ちください」と理由を説明する',
    passiveAction: '「自分はオーダーを取った担当ではないので、担当者を呼んでまいります」と頭を下げて立ち去る',
    rashAction: 'お客様を安心させようと、「あと2〜3分ですぐにお持ちできます！」とその場で確証のない約束をする',
    trapExplanation: '「混んでいるから」という言い訳や、適当な時間での安請け合いは、さらに大きな怒りを呼ぶ原因になります。',
    explanation: 'お待たせしている事実に対して真摯に部分謝罪し、キッチンへ正確な状況とあと何分で出せるかを確認しに行きます。',
    mindsetFeedback: 'お客様の不満を「店舗全体の責任」として受け止め、言い訳をせず誠実に向き合う姿勢が信頼を取り戻します。',
  },
  {
    keywords: ['傘', '雨', '天気', '濡', 'お預かり'],
    situation: '激しい雨が降る夕方、濡れた傘を持ったお客様が来店された場面です。',
    question: '雨天時のお出迎えとして、最も細やかな心配りができている対応はどれでしょうか？',
    correctAction: '「お足元の悪い中ご来店ありがとうございます。よろしければお傘をお預かりいたしましょうか」と笑顔で声をかける',
    trapAction: '「床が濡れて滑ると危ないので、入り口の傘立てに必ず入れてください」とルールを念押しする',
    passiveAction: '天候には触れず、通常通り人数確認とお席への誘導のみを手早く進める',
    rashAction: '傘袋を無言でお客様の前に差し出し、自分で袋に入れるようジェスチャーで促す',
    trapExplanation: '「床が濡れるから」という店舗側の都合を押し付けると、お客様は歓迎されていないと感じてしまいます。',
    explanation: '悪天候の中足を運んでくださったことへの感謝を伝え、お傘のお預かりやタオルのお渡しを行うのが一流の気遣いです。',
    mindsetFeedback: '天候の悪さは最高のおもてなしの好機。お客様の小さな不快や手間を先回りして取り除きましょう。',
  },
  {
    keywords: ['会計', 'お見送り', 'レジ', '退店', '感謝', 'お釣り'],
    situation: 'お食事を終えられたお客様がお会計を済ませ、出入り口からお帰りになる場面です。',
    question: 'お見送りの所作として、お客様の満足度を最後まで保つ最も適切な行動はどれでしょうか？',
    correctAction: 'ドアを開けてお見送りし、お客様が振り返られた際にも笑顔で「ありがとうございました！」と一礼する',
    trapAction: 'お会計が終わった瞬間にレジの締め作業を再開し、下を向いたまま「ありがとうございましたー」と声をかける',
    passiveAction: 'レジカウンターの内側から出ず、会釈だけして次のお客様の伝票整理を始める',
    rashAction: '次のお客様のご案内を優先し、お見送りは背中を向けたまま手短に済ませる',
    trapExplanation: 'お会計が終わるとスタッフの意識が途切れがちですが、最後の瞬間こそ記憶に最も残りやすいポイントです。',
    explanation: '出口まで付き添い、ドアを開けて感謝の言葉を伝えることで、退店時の満足感が強く印象に残ります。',
    mindsetFeedback: 'お出迎えからお見送りまでが一連のストーリー。「また来たい」と思っていただける余韻を残しましょう。',
  }
];

// テキスト内容とマッチングして問題を動的生成する
export const generateQuizQuestionsFromManual = async (
  request: GenerateQuizRequest
): Promise<QuizQuestion[]> => {
  // 非同期処理をシミュレート（思考アニメーションを心地よく演出）
  await new Promise((resolve) => setTimeout(resolve, 600));

  const textToAnalyze = `${request.manualTitle} ${request.manualContent} ${request.focusPoint || ''}`.toLowerCase();

  // マニュアル本文の内容とマッチするシナリオをスコアリング
  const scoredScenarios = HALL_SCENARIOS.map((scenario) => {
    let score = 0;
    for (const kw of scenario.keywords) {
      if (textToAnalyze.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    return { scenario, score };
  });

  // スコア順にソート
  scoredScenarios.sort((a, b) => b.score - a.score);

  const targetCount = Math.min(request.questionCount || 2, 4);
  const selectedScenarios = scoredScenarios.slice(0, targetCount).map((s) => s.scenario);

  return selectedScenarios.map((sc, index) => {
    // 選択肢を4つ構成（正解、ひっかけ、消極的、短絡的）
    const rawOptions = [
      { id: 'A', text: sc.correctAction, isCorrect: true },
      { id: 'B', text: sc.trapAction, isCorrect: false },
      { id: 'C', text: sc.passiveAction, isCorrect: false },
      { id: 'D', text: sc.rashAction, isCorrect: false },
    ];

    // ランダムにシャッフルして正解の位置（A, B, C, D）を分散
    const shuffled = [...rawOptions].sort(() => Math.random() - 0.5);

    const letterIds = ['A', 'B', 'C', 'D'];
    let correctId = 'A';

    const formattedOptions = shuffled.map((item, optIdx) => {
      const assignedId = letterIds[optIdx];
      if (item.isCorrect) {
        correctId = assignedId;
      }
      return {
        id: assignedId,
        text: item.text,
      };
    }) as [QuizOption, QuizOption, QuizOption, QuizOption];

    return {
      id: `ai-gen-${Date.now()}-${index}`,
      sectionId: request.sectionId,
      stepId: request.stepId,
      situation: sc.situation,
      question: sc.question,
      options: formattedOptions,
      correctOptionId: correctId,
      trapExplanation: sc.trapExplanation,
      explanation: sc.explanation,
      mindsetFeedback: sc.mindsetFeedback,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

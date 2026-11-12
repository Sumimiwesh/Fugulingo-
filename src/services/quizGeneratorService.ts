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
    keywords: ['ひれ酒', 'ヒレ酒', '豊祝', '取り出し', '火', '酒'],
    situation: '名物「ひれ酒（880円）」をお客様にお出しした際、ひれの取り扱いについてお客様から尋ねられた場面です。',
    question: '美味しく飲んでいただくためのスタッフの正しいご案内はどれでしょうか？',
    correctAction: '「美味しくお飲みいただくため、お酒に色が付いたらひれはお取り出しください」と小皿を添えて案内する',
    trapAction: '「ひれの旨味をもっと出すために、最後までずっと底に沈めたままにしておいてください」と伝える',
    passiveAction: 'お客様から聞かれるまで何も言わず、ひれの取り出し用小皿も置かずに立ち去る',
    rashAction: '提供した直後、まだ色も付いていないうちにお客様の前でひれをすぐ掴み出してしまう',
    trapExplanation: 'ひれを長時間入れたまま放置すると、ひれから苦味やエグみが出てお酒の味が損なわれてしまいます。',
    explanation: '強火で飴色に炙ったひれの香ばしさが純米酒「豊祝」に移り、黄金色に色づいたらひれを取り出すのが最高の味わい方です。',
    mindsetFeedback: '名物料理だからこそ、最高に美味しい瞬間をお客様に味わっていただくプロの配慮とお声がけを徹底しましょう。',
  },
  {
    keywords: ['つぎ酒', '継ぎ酒', 'おかわり', '何杯'],
    situation: 'ひれ酒を召し上がっているお客様から「つぎ酒って何杯くらい頼めるの？」とご質問いただいた場面です。',
    question: 'つぎ酒のご案内として、メニューの標準に則った最も正確な説明はどれでしょうか？',
    correctAction: '「ひれ酒一杯につき2〜3杯までお楽しみいただけます。熱いお酒を注ぎ、一杯ごとに火をおつけします」',
    trapAction: '「ひれ酒は1杯で終わりですので、つぎ酒はできず最初から一杯頼み直していただくことになります」',
    passiveAction: '「何杯でも無限に注ぎ足せますので、お好きなだけ何十杯でもどうぞ」と適当に答える',
    rashAction: '「冷酒をそのままグラスに注いでいただければ大丈夫です」と間違った飲み方を案内する',
    trapExplanation: 'つぎ酒は1杯のひれで2〜3杯がベストです。また一杯ごとに火をつけてアルコールを飛ばし香りを立たせるのが伝統作法です。',
    explanation: 'ひれの香味は2〜3杯まで美味しく抽出されます。つぎ酒をお持ちした際は、お客様の目の前で火をつけて香りを立たせてご提供します。',
    mindsetFeedback: 'つぎ酒の知識があることで、お客様にお得に名物酒の醍醐味を楽しんでいただく演出ができます。',
  },
  {
    keywords: ['コース', '泳ぎとらふぐ', '順番', 'てっさ', 'てっちり', '唐揚げ', '雑炊'],
    situation: '「国産泳ぎとらふぐコース（お一人様7,500円）」をご注文いただいたお客様に、コースの進行を説明する場面です。',
    question: 'コースの提供順序として、最も正しい組み合わせはどれでしょうか？',
    correctAction: '皮刺し → 泳ぎてっさ → 泳ぎてっちり・なべ皮 → とらふぐ唐揚げ → 雑炊・香物・デザート',
    trapAction: '雑炊・デザート → 泳ぎてっちり → とらふぐ唐揚げ → 泳ぎてっさ → 皮刺し',
    passiveAction: '順番を決めず、キッチンで仕上がった料理から手当たり次第にテーブルへ並べる',
    rashAction: 'すべての料理を一度にテーブルの上に並べきり、お客様に自由に食べてもらう',
    trapExplanation: '冷前菜（皮刺し・てっさ）から始まり、温かい鍋、揚げ物、鍋出汁を使ったシメの雑炊・デザートという完璧なストーリーがあります。',
    explanation: '皮刺し、てっさ、てっちり、唐揚げ、そして旨味の溶け込んだ雑炊と最中アイスまで、計算された順序でおもてなしします。',
    mindsetFeedback: 'コースの全容を把握していることで、お客様の食事の進み具合に合わせた絶妙な配膳ペースをコントロールできます。',
  },
  {
    keywords: ['米', 'ごはん', 'ご飯', '南魚沼', 'コシヒカリ', '金賞'],
    situation: 'お客様から「ここのご飯や雑炊のお米、すごく甘くて美味しいね！」とお褒めをいただいた場面です。',
    question: '当店のお米へのこだわりを伝える説明として、最もふさわしいものはどれでしょうか？',
    correctAction: '「当店では『お米選手権国際大会金賞受賞農家』と専属契約した南魚沼産コシヒカリのみを使用しております」',
    trapAction: '「近所のスーパーで売っている一般的な無洗米を多めの水で柔らかく炊いております」',
    passiveAction: '「お米の銘柄については特に決まりがないので、日によって違うと思います」',
    rashAction: '「ふぐの身をすりつぶして混ぜて炊いているので甘く感じるのだと思います」',
    trapExplanation: '単なるお米ではなく、「金賞受賞農家と専属契約した厳選南魚沼産コシヒカリのみ」を使用しているのが誇りです。',
    explanation: '三つのこだわりにもある通り、白ご飯や雑炊の美味しさを支えるため、金賞受賞農家の南魚沼産コシヒカリを専属契約で仕入れています。',
    mindsetFeedback: 'メインのふぐだけでなく、お米の一粒一粒にまで注がれた店舗の情熱をお客様と共有しましょう。',
  },
  {
    keywords: ['炭火焼き', '焼きふぐ', 'ニンニク', 'タレ', '網'],
    situation: '「炭火焼きふぐ（一人前2,980円）」をご注文されたお客様へ、お召し上がり方をご案内する場面です。',
    question: 'より美味しく召し上がっていただくための声添えとして、最も適切なものはどれでしょうか？',
    correctAction: '「秘伝のタレを絡めております。お好みで特製ニンニクを加えますと、一層香ばしくスタミナ満点でお召し上がりいただけます」',
    trapAction: '「生のままタレをつけて召し上がってください。炭火で焼くと固くなってしまいます」',
    passiveAction: '具材をテーブルに置くだけで、焼き方やおすすめの味付けについては何も説明しない',
    rashAction: '「焦げると危ないので、炭火に水をかけて弱火にしてから焼いてください」と伝える',
    trapExplanation: '醤油ベースの秘伝タレと炭火の遠赤外線効果、そしてお好みで添える「特製ニンニク」が炭火焼きふぐの最大の魅力です。',
    explanation: '炭火で網焼きにすることで旨味が凝縮します。特製ニンニクによる味変の楽しみ方をお伝えするのが最高のサービスです。',
    mindsetFeedback: '料理の美味しい食べ方をワンポイントでお伝えすることで、お客様の食のエンターテインメント体験を高めます。',
  },
  {
    keywords: ['日本酒', '杉勇', '獺祭', '酒', 'おすすめ', '冷酒'],
    situation: 'お客様から「ふぐ料理に一番合うおすすめの日本酒は何？」と尋ねられた場面です。',
    question: '当店の日本酒メニューを踏まえた最高の提案はどれでしょうか？',
    correctAction: '「酒米の王様・山田錦を100%使用した当店オリジナルの純米大吟醸『杉勇（すぎいさみ）』がキレが良く一番おすすめです」',
    trapAction: '「日本酒よりもアルコール度数の高いウイスキーのロックが一番ふぐに合いますよ」',
    passiveAction: '「メニューの日本酒のページを開いて、お客様ご自身で適当にお選びください」',
    rashAction: '「一番値段の高い獺祭だけを頼んでおけば間違いありません」と高圧的に勧める',
    trapExplanation: '当店オリジナル純米大吟醸「杉勇（山形県・山田錦100%・日本酒度+5.0）」という看板酒があります。自信を持ってお勧めしましょう。',
    explanation: 'ふぐの繊細な味を邪魔せず引き立てる辛口の純米大吟醸「杉勇」は、当店限定のオリジナル銘柄として最もおすすめすべき一杯です。',
    mindsetFeedback: '店舗オリジナルの逸品を愛着を持ってお勧めできるスタッフは、お客様からの信頼も格別です。',
  },
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
  }
];

// テキスト内容とマッチングして問題を動的生成する
export const generateQuizQuestionsFromManual = async (
  request: GenerateQuizRequest
): Promise<QuizQuestion[]> => {
  // 思考アニメーション演出
  await new Promise((resolve) => setTimeout(resolve, 500));

  const textToAnalyze = `${request.manualTitle} ${request.manualContent} ${request.focusPoint || ''}`.toLowerCase();

  // マニュアル本文の内容とマッチするシナリオをスコアリング
  const scoredScenarios = HALL_SCENARIOS.map((scenario) => {
    let score = 0;
    for (const kw of scenario.keywords) {
      if (textToAnalyze.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    return { scenario, score };
  });

  // スコア順にソート
  scoredScenarios.sort((a, b) => b.score - a.score);

  const targetCount = Math.min(request.questionCount || 2, 4);
  const selectedScenarios = scoredScenarios.slice(0, targetCount).map((s) => s.scenario);

  return selectedScenarios.map((sc, index) => {
    const rawOptions = [
      { id: 'A', text: sc.correctAction, isCorrect: true },
      { id: 'B', text: sc.trapAction, isCorrect: false },
      { id: 'C', text: sc.passiveAction, isCorrect: false },
      { id: 'D', text: sc.rashAction, isCorrect: false },
    ];

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

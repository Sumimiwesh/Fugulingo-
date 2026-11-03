import { HallManual } from '../types/manual';
import { QuizSection } from '../types/quiz';

export const INITIAL_MANUALS: HallManual[] = [
  {
    id: 'manual-welcome',
    category: 'welcome',
    categoryLabel: 'ご案内・着席',
    title: 'お出迎え・ご案内・ファーストオーダー',
    description: '来店時の第一印象を決める笑顔の挨拶、人数確認、お席への誘導と最初のお伺い手順。',
    currentVersionId: 'v1.1-welcome',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-04-10T14:30:00Z',
    versions: [
      {
        id: 'v1.1-welcome',
        manualId: 'manual-welcome',
        versionNumber: 2,
        versionLabel: 'v1.1 ピーク時対応強化版',
        changeLog: '満席時ウェイティングボード案内手順および雨天時の傘お預かりルールを追加。',
        contentType: 'text',
        content: `【お出迎えとご案内・ファーストオーダー業務標準マニュアル】
1. ドアが開いた瞬間の対応
- お客様が入店されたら3秒以内に「いらっしゃいませ！何名様でしょうか？」と明るく笑顔でアイコンタクトをとる。
- 予約の有無を確認（「ご予約のお名前を伺ってもよろしいでしょうか？」）。
- 満席時は「申し訳ございません。ただいま満席のため約15分ほどお待ちいただいておりますが、こちらのリストにお名前をご記入いただけますでしょうか」と丁寧にお伝えする。

2. お席へのご案内
- お客様の前を2歩程度リードし、「こちらのお席へどうぞ」と手を開いて方向を指し示す（指差しは厳禁）。
- 荷物置きカゴがある場合は「お荷物はこちらのカゴをお使いください」とお声がけする。

3. お冷とおしぼりの提供・ファーストオーダー
- 着席後30秒以内にお冷とおしぼりを右手側からお出しする。
- 「本日のおすすめは〇〇となっております。お決まりになりましたらお呼びください」または「最初にお飲み物はいかがいたしましょうか」と伺う。`,
        status: 'active',
        createdAt: '2026-04-10T14:30:00Z',
        createdBy: '店長 高橋',
      },
      {
        id: 'v1.0-welcome',
        manualId: 'manual-welcome',
        versionNumber: 1,
        versionLabel: 'v1.0 初版制定',
        changeLog: '店舗オープン時の標準基本マニュアル',
        contentType: 'text',
        content: `【基本お出迎え手順】
- 入店時に「いらっしゃいませ」と声をかける。
- 人数を聞いて空いているテーブルに案内する。
- お冷を運ぶ。`,
        status: 'archived',
        createdAt: '2026-03-01T09:00:00Z',
        createdBy: '店長 高橋',
      }
    ]
  },
  {
    id: 'manual-serving',
    category: 'serving',
    categoryLabel: '配膳・中間ケア',
    title: '料理の配膳マナー・中間バッシング',
    description: '正しいトレイの持ち方、料理提供時の声かけ、空いたお皿の下膳（バッシング）タイミング。',
    currentVersionId: 'v1.0-serving',
    createdAt: '2026-03-15T11:00:00Z',
    updatedAt: '2026-03-15T11:00:00Z',
    versions: [
      {
        id: 'v1.0-serving',
        manualId: 'manual-serving',
        versionNumber: 1,
        versionLabel: 'v1.0 標準配膳マニュアル',
        changeLog: '新規アルバイト向け料理配膳および中間下膳の基本ルール',
        contentType: 'text',
        content: `【配膳および中間バッシング業務マニュアル】
1. 料理の提供（デシャップから客席へ）
- 熱い料理は器の底を持たず縁を持つ。トレイの上に滑り止めシートが敷いてあることを確認。
- 提供時は料理名をハッキリと復唱する（「お待たせいたしました、本日の鮮魚カルパッチョでございます」）。
- お客様の手元や会話の邪魔をしないよう、原則「右後方」またはテーブルの空いているスペースから丁寧に置く。
- 熱い鉄板や鍋料理は「お皿が大変お熱くなっておりますのでお気をつけください」と必ず声添えをする。

2. 中間バッシング（お皿下げ）
- グラスやお皿が空いたのを確認したら、「失礼いたします、こちらのお皿お下げしてもよろしいでしょうか？」と必ず一声かける。
- お客様が会話に夢中な場合は強引に割り込まず、視線が合ったタイミングなどを見計らう。
- グラスや皿をテーブルの上で重ねてガタガタ音を立てない。`,
        status: 'active',
        createdAt: '2026-03-15T11:00:00Z',
        createdBy: 'フロアマネージャー 佐藤',
      }
    ]
  },
  {
    id: 'manual-trouble',
    category: 'trouble',
    categoryLabel: 'トラブル・クレーム',
    title: 'イレギュラー・クレーム一次対応',
    description: 'お冷のこぼれ、異物混入、料理提供遅延など現場で起こるトラブルへの初動と謝罪手順。',
    currentVersionId: 'v1.0-trouble',
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
    versions: [
      {
        id: 'v1.0-trouble',
        manualId: 'manual-trouble',
        versionNumber: 1,
        versionLabel: 'v1.0 トラブル対応初動指針',
        changeLog: '全スタッフ必読の現場トラブル・クレーム初期対応マニュアル',
        contentType: 'text',
        content: `【イレギュラー・クレーム一次対応マニュアル】
1. 基本姿勢：部分謝罪と傾聴
- お客様が不快に思われた事実に対して、まず「不快な思いをおかけして大変申し訳ございません」と真摯に謝罪する。
- 自己判断で「キッチンが混んでいて…」などの言い訳をしない。理由を語る前にお客様のお話を最後まで遮らず聞く。

2. お冷やドリンクをこぼしてしまった場合
- 最優先でお客様のお召し物やお怪我の有無を確認する（「お怪我はございませんでしょうか？お洋服は濡れておりませんでしょうか」）。
- 清潔な乾いたダスターやおしぼりを複数枚お持ちし、テーブルと床を素早く拭く。
- すぐに店長・リーダーに報告し、代わりのドリンクを再提供する。

3. 料理の提供が遅いとお叱りを受けた場合
- 「お待たせしてしまい大変申し訳ございません。ただいまキッチンの調理状況を至急確認してまいります」と伝え、走らず速やかにキッチンへ確認。
- あと何分で提供可能かを具体的に把握し、お客様へ正確にお伝えする。`,
        status: 'active',
        createdAt: '2026-04-01T10:00:00Z',
        createdBy: '店長 高橋',
      }
    ]
  }
];

export const INITIAL_SECTIONS: QuizSection[] = [
  {
    id: 'section-1',
    manualId: 'manual-welcome',
    manualVersionId: 'v1.1-welcome',
    order: 1,
    title: '第1章：お出迎えとご案内',
    subtitle: '笑顔のファーストコンタクトとスムーズな着席誘導',
    iconName: 'DoorOpen',
    steps: [
      {
        id: 'step-1-1',
        sectionId: 'section-1',
        stepNumber: 1,
        title: '入店時のファーストコンタクト',
        description: 'お客様が入店された際の初動と人数確認の正しいマナー',
        type: 'lesson',
        passingScorePercent: 100,
        questions: [
          {
            id: 'q-1-1-1',
            sectionId: 'section-1',
            stepId: 'step-1-1',
            situation: 'ディナー営業のピーク時、入り口の扉が開き、新規のお客様が来店された場面です。',
            question: 'スタッフとしての最初の行動として、最も適切なものはどれでしょうか？',
            options: [
              { id: 'A', text: '作業中の手を止めず、手元を見ながら大きめの声で挨拶する' },
              { id: 'B', text: '作業を止め、お客様の目を見て3秒以内に笑顔で挨拶する' },
              { id: 'C', text: '空席の確認を最優先し、席数を確認してから挨拶に向かう' },
              { id: 'D', text: '他のお客様の接客を優先し、ご案内担当が来るのを待つ' },
            ],
            correctOptionId: 'B',
            trapExplanation: '「席を先に数えてから声をかける」「作業をしながら声だけ出す」は新人がやりがちな失敗です。',
            explanation: '入店から3秒以内のアイコンタクトと明るい笑顔の挨拶が、お店の第一印象を決定づけます。作業の手を一時中断してでも、お客様の方を向く姿勢が不可欠です。',
            mindsetFeedback: '「自分はお客様に気づいている」という安心感を瞬時に届けるホスピタリティの基本です。',
            status: 'published'
          },
          {
            id: 'q-1-1-2',
            sectionId: 'section-1',
            stepId: 'step-1-1',
            situation: '満席時に、予約をしていないお客様が来店され、席を希望されたシチュエーションです。',
            question: 'お客様をお待たせする際の一次案内として、最も丁寧で適切な表現はどれでしょうか？',
            options: [
              { id: 'A', text: '「満席なので、外のベンチでお待ちいただけますでしょうか」' },
              { id: 'B', text: '「席が空き次第お呼びしますので、そちらでお待ちください」' },
              { id: 'C', text: '「恐れ入ります。現在満席で約15分程のお待ちとなりますが、お名前を伺えますか」' },
              { id: 'D', text: '「本日は大変混雑しておりますので、後ほど再度ご来店いただけますか」' },
            ],
            correctOptionId: 'C',
            trapExplanation: '単に「待ってください」とだけ伝えると、お客様はいつ席に着けるか見通しが立たず不安や不満になります。',
            explanation: 'クッション言葉（恐れ入ります）を用い、具体的な見込み待ち時間（約15分等）を提示した上で、ウェイティングボードへの記入を促すのが標準の接客です。',
            mindsetFeedback: '不都合なお願いをする時こそ、見通しと選択肢を提示することで、お客様の時間を尊重する姿勢を示せます。',
            status: 'published'
          }
        ]
      },
      {
        id: 'step-1-2',
        sectionId: 'section-1',
        stepNumber: 2,
        title: 'お席への誘導とジェスチャー',
        description: 'お客様をお席までスマートにご案内する立ち位置と手の示し方',
        type: 'lesson',
        passingScorePercent: 100,
        questions: [
          {
            id: 'q-1-2-1',
            sectionId: 'section-1',
            stepId: 'step-1-2',
            situation: '入り口から奥のテーブル席までお客様をご案内する歩行・誘導の場面です。',
            question: '歩くスピードや立ち位置として、最もふさわしいご案内方法はどれでしょうか？',
            options: [
              { id: 'A', text: 'お客様の2歩ほど前を歩き、時折振り返りながらペースを合わせる' },
              { id: 'B', text: '案内を迅速に終えるため、大股で早歩きでお席へ先回りして待機する' },
              { id: 'C', text: 'お客様の真横にぴったり並び、肩を並べながら通路を進む' },
              { id: 'D', text: '入り口から指を差して「奥の4番テーブルへどうぞ」と声掛けする' },
            ],
            correctOptionId: 'A',
            trapExplanation: '急いで先に行ってしまったり、離れた場所から指差し案内をするのは重大なマナー違反です。',
            explanation: 'お客様の2歩前をリードし、お客様の歩くペースに合わせて時折視線を配りながら歩くのが美しいご案内の所作です。',
            mindsetFeedback: 'お客様の歩幅に寄り添うことは、心地よい空間作りへの第一歩です。',
            status: 'published'
          },
          {
            id: 'q-1-2-2',
            sectionId: 'section-1',
            stepId: 'step-1-2',
            situation: 'テーブルの前に到着し、お客様にお座りいただく席を手の動作で示す場面です。',
            question: 'お席を示すハンドジェスチャーとして、最も好ましい作法はどれでしょうか？',
            options: [
              { id: 'A', text: '人差し指で椅子の座面を指して「こちらへどうぞ」と促す' },
              { id: 'B', text: '親指を立てて方向を示し、笑顔で「こちらの席です」と伝える' },
              { id: 'C', text: '指先を揃えて手のひらを上に向け、斜め下へ差し出して案内する' },
              { id: 'D', text: 'メニュー表を持った手でそのままテーブルをトントンと叩く' },
            ],
            correctOptionId: 'C',
            trapExplanation: '指差し（人差し指）は人物にも物にも失礼にあたります。揃えた手のひらを使うのが接客の基本です。',
            explanation: '指先を揃え、手のひらを上に向けて斜め45度程度に柔らかく差し出すのが、品格のあるご案内マナーです。',
            mindsetFeedback: '手のひらは歓迎の証。指先ひとつにも感謝と歓迎の心を込めましょう。',
            status: 'published'
          }
        ]
      },
      {
        id: 'step-1-3',
        sectionId: 'section-1',
        stepNumber: 3,
        title: 'ファーストオーダーとお冷の提供',
        description: '着席後のファーストアプローチとおすすめの伝え方',
        type: 'lesson',
        passingScorePercent: 100,
        questions: [
          {
            id: 'q-1-3-1',
            sectionId: 'section-1',
            stepId: 'step-1-3',
            situation: 'お客様が着席された直後、お冷とおしぼりを提供するタイミングと位置の場面です。',
            question: 'お冷やおしぼりの配膳マナーとして、最も適切なものはどれでしょうか？',
            options: [
              { id: 'A', text: '着席から30秒以内を目安に、お客様の右手側から丁寧にお出しする' },
              { id: 'B', text: '料理と一緒に持っていくため、注文が決まるまでお冷は出さない' },
              { id: 'C', text: '作業効率を重視し、テーブルの端にまとめてドンと置く' },
              { id: 'D', text: 'お客様の左奥から腕を伸ばして、会話の邪魔にならないよう置く' },
            ],
            correctOptionId: 'A',
            trapExplanation: '料理と一緒に持って行こうと後回しにすると、喉が渇いているお客様を待たせることになります。',
            explanation: '着席後すみやかにお冷とおしぼりを提供します。原則として右利きの方が多い配慮から右手側から提供するのが一般的です。',
            mindsetFeedback: '席に着いて最初の手渡し品であるおしぼりは、お店のおもてなしの温もりを直接伝えるアイテムです。',
            status: 'published'
          }
        ]
      },
      {
        id: 'step-1-4',
        sectionId: 'section-1',
        stepNumber: 4,
        title: '第1章 修了確認テスト（総合判定）',
        description: 'お出迎えから着席誘導、ファーストオーダーまでの総まとめテスト',
        type: 'checkpoint',
        passingScorePercent: 80,
        questions: [
          {
            id: 'q-1-4-1',
            sectionId: 'section-1',
            stepId: 'step-1-4',
            situation: '雨の日の夜、濡れた傘を持ったお客様が来店された際の対応です。',
            question: 'お客様へのファーストアプローチとして、最も配慮の行き届いた対応はどれでしょうか？',
            options: [
              { id: 'A', text: '「床が濡れるので、傘立てに必ず入れてください」と注意を促す' },
              { id: 'B', text: '「お足元の悪い中ありがとうございます。お傘をお預かりいたしましょうか」と声をかける' },
              { id: 'C', text: '傘には触れず、通常通り人数のみを聞いてテーブルへ誘導する' },
              { id: 'D', text: 'ビニール袋を黙って手渡し、ご自身で包んでいただくよう促す' },
            ],
            correctOptionId: 'B',
            trapExplanation: '「床が濡れるから」という店舗都合を押し出すとお客様は歓迎されていないと感じてしまいます。',
            explanation: '天候への気遣い（お足元の悪い中…）を添え、濡れたお傘をお預かりする、または傘袋を丁寧に差し出すのが最高の接客です。',
            mindsetFeedback: '天候の悪さは最高のおもてなしチャンス。お客様の不快感を先回りして取り除きましょう。',
            status: 'published'
          },
          {
            id: 'q-1-4-2',
            sectionId: 'section-1',
            stepId: 'step-1-4',
            situation: '小さなお子様連れのお客様をご案内する際のお席選びです。',
            question: 'ご案内する席の選定として、最も気遣いのできている判断はどれでしょうか？',
            options: [
              { id: 'A', text: '他のお客様から見えにくいよう、最も薄暗い隅の狭い席へ誘導する' },
              { id: 'B', text: '出入りがしやすくベビーカーが置けるスペースのある、ソファー席や広めの席へ誘導する' },
              { id: 'C', text: '騒がしくなることを見越し、配膳用通路の真ん中の席へ手早く通す' },
              { id: 'D', text: '子供用の椅子を置くのが面倒なので、カウンター席を指定する' },
            ],
            correctOptionId: 'B',
            trapExplanation: '端に追いやるような案内はお客様を傷つけます。安全でゆったりできる席を提案しましょう。',
            explanation: 'ベビーカーの有無や子供用チェアの必要性を考慮し、座りやすいソファー席や広めのテーブルをご提案するのが親切です。',
            mindsetFeedback: 'ファミリー層への配慮は、パパ・ママにとって何よりの救いと感動になります。',
            status: 'published'
          }
        ]
      }
    ]
  },
  {
    id: 'section-2',
    manualId: 'manual-serving',
    manualVersionId: 'v1.0-serving',
    order: 2,
    title: '第2章：料理の配膳と中間バッシング',
    subtitle: '美しく安全なトレイさばきとスマートな下膳の極意',
    iconName: 'Utensils',
    steps: [
      {
        id: 'step-2-1',
        sectionId: 'section-2',
        stepNumber: 1,
        title: '料理提供時の声かけと置き方',
        description: '料理名復唱、置く位置、熱い料理の注意喚起マナー',
        type: 'lesson',
        passingScorePercent: 100,
        questions: [
          {
            id: 'q-2-1-1',
            sectionId: 'section-2',
            stepId: 'step-2-1',
            situation: 'キッチンから仕上がったメイン料理をトレイに乗せ、お客様のテーブルへ運んできた場面です。',
            question: 'テーブルに料理を置く際の手順・声かけとして、最も適切なものはどれでしょうか？',
            options: [
              { id: 'A', text: '無言でテーブルの空いている端に素早く置いて立ち去る' },
              { id: 'B', text: '「お待たせいたしました、〇〇でございます」と料理名を復唱し、手元に置く' },
              { id: 'C', text: 'お客様の会話が終わるまで、トレイを持ったままじっと真横に立ち続ける' },
              { id: 'D', text: '「〇〇頼まれた方どなたですか？」とテーブル全体に大きな声で問い詰める' },
            ],
            correctOptionId: 'B',
            trapExplanation: '伝票で誰が注文したか把握しておくのがプロのホール。誰が頼んだか大声で聞くのは極力避けましょう。',
            explanation: '「お待たせいたしました」の言葉とともに料理名を正確に復唱し、お客様の邪魔にならないスペースへ丁寧に置きます。',
            mindsetFeedback: 'お料理の最後の仕上げはホールの笑顔と丁寧なサーブです。',
            status: 'published'
          }
        ]
      },
      {
        id: 'step-2-2',
        sectionId: 'section-2',
        stepNumber: 2,
        title: '中間バッシングのタイミング',
        description: '空いたお皿を下げる際の一声とスマートな所作',
        type: 'lesson',
        passingScorePercent: 100,
        questions: [
          {
            id: 'q-2-2-1',
            sectionId: 'section-2',
            stepId: 'step-2-2',
            situation: 'お客様のテーブルでお皿が空になり、会話を楽しんでいらっしゃる場面です。',
            question: '空いたお皿を下げる（中間バッシング）際の声かけとして、最も好ましいのはどれでしょうか？',
            options: [
              { id: 'A', text: '会話の切れ目を狙い、「失礼いたします、こちらのお皿お下げしてもよろしいでしょうか？」と伺う' },
              { id: 'B', text: 'お客様が話している最中に無言で背後から腕を伸ばして皿をサッと奪う' },
              { id: 'C', text: '「食べ終わりましたね」と言いながら、皿の上で他のお皿を重ねて持ち上げる' },
              { id: 'D', text: '退店まで一切お皿には触れず、お会計後に一括して片付ける' },
            ],
            correctOptionId: 'A',
            trapExplanation: '無言で下げるのは驚かせてしまいます。またテーブル上で皿を重ねて音を立てるのも厳禁です。',
            explanation: '会話の邪魔にならないタイミングで必ず承諾を得てから下げます。テーブルの上を常に清潔に保つことで居心地が向上します。',
            mindsetFeedback: '下膳は「早く帰ってほしい」合図ではなく、「次の料理を心地よく楽しむためのスペース作り」です。',
            status: 'published'
          }
        ]
      },
      {
        id: 'step-2-3',
        sectionId: 'section-2',
        stepNumber: 3,
        title: '第2章 修了確認テスト（総合判定）',
        description: '配膳と中間バッシングに関する総合実技クイズ',
        type: 'checkpoint',
        passingScorePercent: 80,
        questions: [
          {
            id: 'q-2-3-1',
            sectionId: 'section-2',
            stepId: 'step-2-3',
            situation: 'グラタンなど非常に高温の器に入った料理を配膳する場面です。',
            question: 'お客様の火傷を防ぐための対応として、最も徹底すべき行動はどれでしょうか？',
            options: [
              { id: 'A', text: '熱いことは見ればわかるので、何も言わずに素早く置いて下がる' },
              { id: 'B', text: '「器が大変お熱くなっておりますので、お気をつけください」と必ず目を見て添える' },
              { id: 'C', text: '冷めるまでキッチンカウンターに10分ほど放置してから持っていく' },
              { id: 'D', text: 'お客様の手を取って器の温度を確かめてもらう' },
            ],
            correctOptionId: 'B',
            trapExplanation: '当たり前のことと思わず、言葉で注意喚起することが事故を未然に防ぎます。',
            explanation: '熱いお皿や鉄板を提供する際は、必ず注意喚起の言葉を添えます。お子様がいる場合は手が届かない位置に置く配慮も必要です。',
            mindsetFeedback: '安全管理は何よりも優先されるおもてなしです。',
            status: 'published'
          }
        ]
      }
    ]
  },
  {
    id: 'section-3',
    manualId: 'manual-trouble',
    manualVersionId: 'v1.0-trouble',
    order: 3,
    title: '第3章：トラブル・クレーム一次対応',
    subtitle: 'ピンチを信頼に変える誠実な初期対応と報連相',
    iconName: 'ShieldAlert',
    steps: [
      {
        id: 'step-3-1',
        sectionId: 'section-3',
        stepNumber: 1,
        title: 'お冷やドリンクをこぼした時の初動',
        description: 'お客様の安全確認、素早い拭き取り、店長へのエスカレーション',
        type: 'lesson',
        passingScorePercent: 100,
        questions: [
          {
            id: 'q-3-1-1',
            sectionId: 'section-3',
            stepId: 'step-3-1',
            situation: '誤ってお冷のグラスを倒し、お客様のテーブルと衣服に水がかかってしまった場面です。',
            question: 'スタッフが最優先で行うべき第一声と行動はどれでしょうか？',
            options: [
              { id: 'A', text: '「申し訳ございません！お怪我やお洋服は濡れておりませんでしょうか！」とお気遣いし清潔なおしぼりを渡す' },
              { id: 'B', text: '割れたグラスを弁償してもらうため、レジへ確認に向かう' },
              { id: 'C', text: '「お客様が腕をぶつけられたので…」と原因をその場で説明する' },
              { id: 'D', text: '自分の服が濡れていないかまず確認し、洗面所へ着替えに行く' },
            ],
            correctOptionId: 'A',
            trapExplanation: '言い訳や物の心配ではなく、お客様ご自身の身体とお召し物の心配が最優先です。',
            explanation: 'まずは心からの謝罪と共にお客様の怪我やお洋服の被害を確認し、新しい乾いたおしぼりやダスターを速やかにお持ちします。',
            mindsetFeedback: 'トラブル時に人間の本性が出ます。自分を守るのではなく、相手を守る姿勢が信頼を生みます。',
            status: 'published'
          }
        ]
      },
      {
        id: 'step-3-2',
        sectionId: 'section-3',
        stepNumber: 2,
        title: '第3章 修了確認テスト（総合判定）',
        description: 'クレーム初期対応における傾聴とエスカレーションの総確認',
        type: 'checkpoint',
        passingScorePercent: 80,
        questions: [
          {
            id: 'q-3-2-1',
            sectionId: 'section-3',
            stepId: 'step-3-2',
            situation: 'お客様から「注文してから30分も料理が来ない」と強い口調でお叱りを受けた場面です。',
            question: '新人の一次対応として、最も信頼を損なわない行動はどれでしょうか？',
            options: [
              { id: 'A', text: '「大変お待たせして申し訳ございません。至急キッチンの進行状況を確認してまいります」と伝えすぐ確認する' },
              { id: 'B', text: '「キッチンが今大変混み合っておりますのでもう少々お待ちください」と言い訳してその場でなだめる' },
              { id: 'C', text: '「自分はオーダーを取った担当ではないのでわかりません」と担当者を呼びに行く' },
              { id: 'D', text: '怖くなって何も言えずにそのままレジの裏へ隠れてしまう' },
            ],
            correctOptionId: 'A',
            trapExplanation: '「混んでいるから」という言い訳や「自分の担当じゃない」という責任逃れはお客様の怒りを増幅させます。',
            explanation: 'お待たせしている事実に対して真摯に部分謝罪し、事実確認のためにキッチンへ走らず速やかに確認に向かうのが正解です。',
            mindsetFeedback: 'お客様の不満を「店全体の課題」として受け止める責任感がプロのホールスタッフです。',
            status: 'published'
          }
        ]
      }
    ]
  }
];

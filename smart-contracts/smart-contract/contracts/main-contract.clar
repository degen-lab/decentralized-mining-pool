;; (use-trait return-map-1 .map-trait-1.return-map-1)

(define-constant err-invalid (err u300))
(define-constant err-list-length-exceeded (err u101))
(define-constant err-already-asked-to-join (err u102))
(define-constant err-already-joined (err u103))
(define-constant err-not-in-miner-map (err u104))
(define-constant err-no-vote-permission (err u105))
(define-constant err-more-blocks-to-pass (err u106))
(define-constant err-no-pending-miners (err u107))
(define-constant err-already-voted (err u108))
(define-constant err-not-asked-to-join (err u109))
(define-constant err-cant-unwrap-check-miner (err u110))
(define-constant err-cant-unwrap-asked-to-join (err u111))
(define-constant err-cant-unwrap-block-info (err u112))
(define-constant err-currently-notifier (err u113))
(define-constant err-not-in-miner-map-miner-to-remove (err u114))
(define-constant err-already-proposed-for-removal (err u116))
(define-constant err-not-proposed-for-removal (err u117))
(define-constant err-cant-remove-when-alone-in-pool (err u118))
(define-constant err-cant-vote-himself (err u119))
(define-constant err-cant-change-notifier (err u120))
(define-constant err-already-proposed-for-notifier (err u121))
(define-constant err-not-proposed-for-removal-k-missing (err u122))
(define-constant err-not-proposed-for-notifier-k-missing (err u123))
(define-constant err-not-proposed-notifier (err u124))
(define-constant err-already-notifier (err u125))
(define-constant err-not-in-miner-map-proposed-notifier (err u126))
(define-constant err-vote-started-already (err u127))
(define-constant err-voting-still-active (err u128))
(define-constant err-not-voting-period (err u129))
(define-constant err-not-waiting (err u130)) 
(define-constant err-not-pending (err u131))
(define-constant err-no-join-block-data (err u132))
(define-constant err-not-voted (err u133))
(define-constant err-only-notifier (err u134))
(define-constant err-one-warning-per-block (err u135))
(define-constant err-block-height-invalid (err u136))
(define-constant err-no-reward-yet (err u137))
(define-constant err-unwrap-miner-index (err u999))
(define-constant err-insufficient-balance (err u1001))
(define-constant err-missing-balance (err u1002))
(define-constant err-already-distributed (err u1003))
(define-constant err-cant-unwrap-rewarded-block (err u1004))

(define-constant notifier-election-blocks-to-pass u144)
(define-constant blocks-to-pass u100)

(define-map balance principal uint)
(define-map claimed-rewards { block-number: uint } { claimed: bool })
(define-map add-lists-principal { address: principal } { values: (list 300 principal) })
(define-map map-is-miner { address: principal } { value: bool })
(define-map map-is-waiting { address: principal } { value: bool })
(define-map map-is-pending { address: principal } { value: bool })
(define-map map-is-proposed-for-removal { address: principal } { value: bool })
(define-map map-block-asked-to-join { address: principal } { value: uint })
(define-map map-block-proposed-to-remove { address: principal } { value: uint })
(define-map map-block-joined { address: principal } { block-height: uint })
(define-map map-balance-stx { address: principal } { value: uint })
(define-map map-balance-xBTC { address: principal } { value: uint })
(define-map map-votes-accept-join { address: principal } { value: uint })
(define-map map-votes-reject-join { address: principal } { value: uint })
(define-map map-votes-accept-removal { address: principal } { value: uint })
(define-map map-votes-reject-removal { address: principal } { value: uint })
(define-map map-join-request-voter { miner-to-vote: principal, voter: principal } { value: bool })
(define-map map-remove-request-voter { miner-to-vote: principal, voter: principal } { value: bool })
(define-map map-voted-update-notifier { miner-who-voted: principal } { miner-voted: principal })
(define-map map-votes-notifier { voted-notifier: principal } { votes-number: uint })
(define-map map-blacklist { address: principal } { value: bool })
(define-map map-total-withdraw { address: principal } { value: uint })
(define-map map-warnings { address: principal } { value: uint })

(define-data-var miners-list-len-at-reward-block uint u0)
(define-data-var notifier principal tx-sender)
(define-data-var waiting-list (list 300 principal) (list ))
(define-data-var miners-list (list 300 principal) (list (var-get notifier)))
(define-data-var pending-accept-list (list 300 principal) (list ))
(define-data-var proposed-removal-list (list 300 principal) (list ))
(define-data-var n uint u1)
(define-data-var k-percentage uint u67)
(define-data-var k uint u0)
(define-data-var k-critical uint u75)
(define-data-var waiting-list-miner-to-remove principal tx-sender) ;; use in remove-principal-miners-list
(define-data-var pending-accept-list-miner-to-remove principal tx-sender)
(define-data-var miners-list-miner-to-remove principal tx-sender)
(define-data-var proposed-removal-list-miner-to-remove principal tx-sender)
(define-data-var last-join-done uint u1)
(define-data-var miner-to-remove-votes-join principal tx-sender)
(define-data-var miner-to-remove-votes-remove principal tx-sender)
(define-data-var notifier-previous-entries-removed bool true)
(define-data-var notifier-vote-active bool false)
(define-data-var notifier-vote-start-block uint u0)
(define-data-var notifier-vote-end-block uint u0)
(define-data-var max-votes-notifier uint u0)
(define-data-var max-voted-proposed-notifier principal tx-sender)
(define-data-var reward uint u0)

(map-set map-is-miner {address: tx-sender} {value: true})
(map-set map-block-asked-to-join {address: tx-sender} {value: u0})
(map-set balance tx-sender u0)
;; at new join -> block height - last-join-done >= 100 !

;; READ ONLY FE UTILS

;; waiting miners 

(define-read-only (get-all-data-waiting-miners (waiting-miners-list (list 100 principal))) 
(map get-data-waiting-miner waiting-miners-list))

(define-private (get-data-waiting-miner (miner principal))
(begin 
  (asserts! (is-some (get value (map-get? map-is-waiting {address: miner}))) err-not-waiting)
  (asserts! (unwrap-panic (get value (map-get? map-is-waiting {address: miner}))) err-not-waiting)
  (ok 
    {
      miner: miner, 
      positive-votes: 
        (if 
          (is-some (get value (map-get? map-votes-accept-join {address: miner}))) 
          (unwrap-panic (get value (map-get? map-votes-accept-join {address: miner}))) 
          u0), 
      negative-votes:
        (if 
          (is-some (get value (map-get? map-votes-reject-join {address: miner}))) 
          (unwrap-panic (get value (map-get? map-votes-reject-join {address: miner}))) 
          u0),
      positive-threshold: 
        (if 
          (is-eq (unwrap-panic (get-k-at-block-asked-to-join miner)) u0) 
          u1 
          (unwrap-panic (get-k-at-block-asked-to-join miner))),
      negative-threshold: 
        (if   
          (is-eq (unwrap-panic (get-n-at-block-asked-to-join miner)) u1) 
          u1 
          (if 
            (is-eq (unwrap-panic (get-n-at-block-asked-to-join miner)) u2) 
            u2 
            (+ (- (unwrap-panic (get-n-at-block-asked-to-join miner)) (unwrap-panic (get-k-at-block-asked-to-join miner))) u1))),
      was-blacklist: (if (is-some (get value (map-get? map-blacklist {address: miner}))) (unwrap-panic (get value (map-get? map-blacklist {address: miner}))) false)
    })))

;; proposed for removal miners

(define-read-only (get-all-data-miners-proposed-for-removal (removal-miners-list (list 100 principal))) 
(map get-data-miner-proposed-for-removal removal-miners-list))

(define-private (get-data-miner-proposed-for-removal (miner principal)) 
(begin 
  (asserts! (is-some (get value (map-get? map-is-pending {address: miner}))) err-not-pending)
  (asserts! (unwrap-panic (get value (map-get? map-is-pending {address: miner}))) err-not-pending)
  (ok 
    {
      miner: miner,
      votes-for-removal: 
        (if 
          (is-some (get value (map-get? map-votes-accept-removal {address: miner}))) 
          (unwrap-panic (get value (map-get? map-votes-accept-removal {address: miner}))) 
          u0),
      votes-against-removal: 
        (if 
          (is-some (get value (map-get? map-votes-reject-removal {address: miner}))) 
          (unwrap-panic (get value (map-get? map-votes-reject-removal {address: miner}))) 
          u0),
      positive-threshold: 
        (if 
          (is-eq (unwrap-panic (get-k-at-block-proposed-removal miner)) u0) 
          u1 
          (unwrap-panic (get-k-at-block-proposed-removal miner))),
      negative-threshold: 
        (if   
          (is-eq (unwrap-panic (get-n-at-block-proposed-removal miner)) u2) 
          u1 
          (if (is-eq (unwrap-panic (get-n-at-block-proposed-removal miner)) u3) 
            u2 
            (+ 
              (- 
                (unwrap-panic (get-n-at-block-proposed-removal miner)) 
                (unwrap-panic (get-k-at-block-proposed-removal miner))) u1)))
    })))

;; pending accept miners

(define-read-only (get-all-data-miners-pending-accept (pending-miners-list (list 100 principal))) 
(map get-data-miner-pending-accept pending-miners-list))

(define-private (get-data-miner-pending-accept (miner principal)) 
(begin 
  (asserts! (is-some (get value (map-get? map-is-pending {address: miner}))) err-not-pending)
  (asserts! (unwrap-panic (get value (map-get? map-is-pending {address: miner}))) err-not-pending)
  (ok 
    {
      miner: miner,
      remaining-blocks-until-join: (- blocks-to-pass (- block-height (var-get last-join-done)))
    })))

;; blocks number as miner

(define-read-only (get-all-data-miners-blocks (local-miners-list (list 100 principal))) 
(map get-data-miner-blocks local-miners-list))

(define-private (get-data-miner-blocks (miner principal)) 
(begin 
  (asserts! (is-some (get value (map-get? map-is-miner {address: miner}))) err-not-in-miner-map)
  (asserts! (unwrap-panic (get value (map-get? map-is-miner {address: miner}))) err-not-in-miner-map)
  (asserts! (is-some (get block-height (map-get? map-block-joined {address: miner}))) err-no-join-block-data)
  (ok 
    {
      miner: miner,
      blocks-as-miner: (- block-height (unwrap-panic (get block-height (map-get? map-block-joined {address: miner}))))
    })))

;; notifier

(define-read-only (get-data-notifier-election-process)
{
  vote-status: (var-get notifier-vote-active), 
  election-blocks-remaining: (- (var-get notifier-vote-end-block) block-height)})

(define-read-only (get-all-data-notifier-voter-miners (voter-miners-list (list 100 principal)))
(map get-data-notifier-voter-miner voter-miners-list))

(define-private (get-data-notifier-voter-miner (miner principal)) 
(begin 
  (asserts! (is-some (get miner-voted (map-get? map-voted-update-notifier {miner-who-voted: miner}))) err-not-voted)
  (ok 
    {
      miner: miner,
      voted-notifier: 
      (unwrap-panic (get miner-voted (map-get? map-voted-update-notifier {miner-who-voted: miner}))) 
    })))

;; balances 

(define-read-only (was-block-claimed (given-block-height uint)) 
  (if 
    (is-none (get claimed (map-get? claimed-rewards {block-number: given-block-height}))) 
    false 
    (if 
      (unwrap-panic (get claimed (map-get? claimed-rewards {block-number: given-block-height}))) 
      true 
      false)))

(define-read-only (get-all-data-balance-miners (local-miners-list (list 100 principal))) 
(map get-data-balance-miner local-miners-list))

(define-private (get-data-balance-miner (miner principal)) 
(begin 
  (asserts! (is-some (get value (map-get? map-is-miner {address: miner}))) err-not-in-miner-map)
  (ok 
    {
      miner: miner,
      balance: 
        (if 
          (is-some (get value (map-get? map-balance-stx {address: miner}))) 
          (unwrap-panic (get value (map-get? map-balance-stx {address: miner}))) 
          u0)
    })))

;; BALANCES FLOW

;; read balance
(define-read-only (get-balance (address principal)) 
(map-get? balance address))

;; deposit funds
(define-public (deposit-stx (amount uint))
(let ((sender tx-sender)
      (balance-sender (map-get? balance sender)))
  (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
  (if (is-none balance-sender) 
    (ok (map-set balance sender amount))
    (ok (map-set balance sender (+ (unwrap! balance-sender err-missing-balance) amount))))))

;; withdraw funds
(define-public (withdraw-stx (amount uint)) 
(let ((receiver tx-sender)) 
  (asserts! (>= (unwrap! (map-get? balance receiver) err-missing-balance) amount) err-insufficient-balance)
  (try! (as-contract (stx-transfer? amount (as-contract tx-sender) receiver)))
  (if 
    (is-some (get value (map-get? map-total-withdraw {address: receiver}))) 
    (map-set map-total-withdraw {address: receiver} {value: (+ (unwrap-panic (get value (map-get? map-total-withdraw {address: receiver}))) amount)}) 
    (map-set map-total-withdraw {address: receiver} {value: amount}))
  (ok (map-set balance receiver (- (unwrap! (map-get? balance receiver) err-missing-balance) amount)))))

(define-public (reward-distribution (block-number uint))
(begin 
  (asserts! (< block-number block-height) err-block-height-invalid) ;; +100  ? 
  (asserts! (is-none (get claimed (map-get? claimed-rewards {block-number: block-number}))) err-already-distributed)
  (asserts! (is-some (get reward (get-reward-at-block block-number))) err-no-reward-yet)
  (let ((miners-list-at-reward-block (at-block (unwrap! (get-block-info? id-header-hash block-number) err-cant-unwrap-rewarded-block) (var-get miners-list)))
        (block-reward (get-reward-at-block block-number)))
    (print block-reward)
    ;; (asserts! (is-eq (unwrap-panic (get claimer block-reward)) (as-contract tx-sender)) err-not-claimer)
    (map-set claimed-rewards {block-number: block-number} {claimed: true})
    (var-set miners-list-len-at-reward-block (len miners-list-at-reward-block)) 
    (var-set reward (unwrap-panic (get reward block-reward)))
    (map distribute-reward-each-miner miners-list-at-reward-block)
    (ok true))))

(define-private (distribute-reward-each-miner (miner principal)) 
(map-set balance miner (+ (unwrap-panic (map-get? balance miner)) (/ (var-get reward) (var-get miners-list-len-at-reward-block)))))

;; JOINING FLOW

;; TODO: when integrated with Bridge ( AlexGo & MagicBridge )
(define-public (ask-to-join (btc-address principal))
(begin 
  (asserts! (not (check-is-miner-now tx-sender)) err-already-joined) 
  (asserts! (not (check-is-waiting-now tx-sender)) err-already-asked-to-join) 
  (map-set map-block-asked-to-join {address: tx-sender} {value: block-height})
  (var-set waiting-list (unwrap-panic (as-max-len? (concat (var-get waiting-list) (list tx-sender)) u300)))
  (map-set map-is-waiting {address: tx-sender} {value: true})
  (ok true)))

(define-public (vote-positive-join-request (miner-to-vote principal))
(begin
  (asserts! (check-is-waiting-now miner-to-vote) err-not-asked-to-join) ;; map_is_waiting
    (asserts! (unwrap! (check-is-miner-when-requested-join miner-to-vote) err-cant-unwrap-check-miner) err-no-vote-permission)
    (asserts! (has-voted-join miner-to-vote) err-already-voted) ;; O(1)
    (map-set map-join-request-voter 
      {miner-to-vote: miner-to-vote, voter: tx-sender} 
      {value: true})
    (if (is-some (get value (map-get? map-votes-accept-join {address: miner-to-vote}))) 
      (map-set map-votes-accept-join {address: miner-to-vote} {value: (+ (unwrap-panic (get value (map-get? map-votes-accept-join {address: miner-to-vote}))) u1)})
      (map-set map-votes-accept-join {address: miner-to-vote} {value: u1}))
    (ok true)))

(define-public (vote-negative-join-request (miner-to-vote principal))
(begin
  (asserts! (check-is-waiting-now miner-to-vote) err-not-asked-to-join)
    (asserts! (unwrap! (check-is-miner-when-requested-join miner-to-vote) err-cant-unwrap-check-miner) err-no-vote-permission)
    (asserts! (has-voted-join miner-to-vote) err-already-voted)    
    (map-set map-join-request-voter 
      {miner-to-vote: miner-to-vote, voter: tx-sender} 
      {value: true})
    (if (is-some (get value (map-get? map-votes-reject-join {address: miner-to-vote}))) 
      (map-set map-votes-reject-join {address: miner-to-vote} {value: (+ (unwrap-panic (get value (map-get? map-votes-reject-join {address: miner-to-vote}))) u1)})
      (map-set map-votes-reject-join {address: miner-to-vote} {value: u1}))  
    (some
      (if (is-vote-rejected-join (unwrap-panic (get value (map-get? map-votes-reject-join {address: miner-to-vote}))) (unwrap-panic (get-k-at-block-asked-to-join miner-to-vote)) (unwrap-panic (get-n-at-block-asked-to-join miner-to-vote)))
        (reject-miner-in-pool miner-to-vote) 
        false))
    (ok true)))

(define-private (accept-miner-in-pool (miner principal)) 
(begin 
  (let ((pending-accept-result (as-max-len? (concat (var-get pending-accept-list) (list miner)) u300)))
  (asserts! (is-some pending-accept-result) err-list-length-exceeded) ;; O(1) 
  (map-set map-warnings {address: miner} {value: u0})
  (map-set balance miner u0)
  (var-set miner-to-remove-votes-join miner)
  (var-set waiting-list (unwrap-panic (as-max-len? (unwrap-panic (remove-principal-waiting-list miner)) u300))) ;; O(N)
  (map-delete map-is-waiting {address: miner})
  (map-set map-is-pending {address: miner} {value: true})
  (clear-votes-map-join-vote miner)
  (ok (var-set pending-accept-list (unwrap-panic pending-accept-result))))))

(define-private (reject-miner-in-pool (miner principal)) 
(begin 
  (let ((remove-result (unwrap-panic (remove-principal-waiting-list miner))))
    (var-set miner-to-remove-votes-join miner)
    (var-set waiting-list remove-result)
    (map-delete map-is-waiting {address: miner})
    (clear-votes-map-join-vote miner)
    true)))

(define-private (clear-votes-map-join-vote (miner principal)) 
(begin 
  (map-delete map-votes-accept-join {address: (var-get miner-to-remove-votes-join)})
  (map-delete map-votes-reject-join {address: (var-get miner-to-remove-votes-join)})
  (map-delete map-block-asked-to-join {address: (var-get miner-to-remove-votes-join)})
  (map remove-map-record-join-vote (var-get miners-list))))

(define-private (remove-map-record-join-vote (miner principal))
(if (is-some (map-get? map-join-request-voter {miner-to-vote: (var-get miner-to-remove-votes-join), voter: miner})) 
  (map-delete map-join-request-voter {miner-to-vote: (var-get miner-to-remove-votes-join), voter: miner})
  false))

(define-private (is-in-voters-list (miner principal) (voters-list (list 300 principal))) 
(is-some (index-of? voters-list miner)))

(define-private (has-voted-join (miner principal)) 
(not (if (is-some (get value (map-get? map-join-request-voter {miner-to-vote: miner, voter: tx-sender})))
          (unwrap-panic (get value (map-get? map-join-request-voter {miner-to-vote: miner, voter: tx-sender})))
          false)))

(define-public (try-enter-pool)
(begin 
  (asserts! (is-some (get value (map-get? map-votes-accept-join {address: tx-sender}))) err-not-asked-to-join)
  (if (is-vote-accepted (unwrap-panic (get value (map-get? map-votes-accept-join {address: tx-sender}))) (unwrap-panic (get-k-at-block-asked-to-join tx-sender)))
    (accept-miner-in-pool tx-sender) 
    (ok false))))

(define-public (add-pending-miners-to-pool) 
(begin
  (let ((len-pending-accept-list (len (var-get pending-accept-list))))
    (asserts! (not (is-eq len-pending-accept-list u0)) err-no-pending-miners)
    (asserts! (x-blocks-passed blocks-to-pass) err-more-blocks-to-pass)
    (map add-miner-to-pool (var-get pending-accept-list))
    (asserts! (is-some (as-max-len? (concat (var-get miners-list) (var-get pending-accept-list)) u300)) err-list-length-exceeded)
    (var-set miners-list (unwrap-panic (as-max-len? (concat (var-get miners-list) (var-get pending-accept-list)) u300)))
    (var-set n (+ (var-get n) len-pending-accept-list))
    (var-set pending-accept-list (list ))
    (var-set last-join-done block-height)
    (some (update-threshold))
    (ok true))))

(define-private (update-threshold) 
(var-set k (/ (* (var-get k-percentage) (- (var-get n) u1)) u100)))

(define-public (add-miner-to-pool (miner principal))
(begin 
  (map-delete map-is-pending {address: miner})
  (map-set map-is-miner {address: miner} {value: true})
  (map-set map-block-joined {address: miner} {block-height: block-height})
  (ok true)))

(define-private (x-blocks-passed (x uint)) 
(if (>= (- block-height (var-get last-join-done)) x)
  true
  false))

(define-private (get-k-at-block-asked-to-join (miner-to-vote principal)) 
(begin 
  (asserts! (is-some (get value (map-get? map-block-asked-to-join {address: miner-to-vote}))) err-not-asked-to-join)
  (at-block 
    (unwrap-panic 
      (get-block-info? id-header-hash 
        (unwrap-panic 
          (get value 
            (map-get? map-block-asked-to-join {address: miner-to-vote}))))) 
            (ok (var-get k)))))

(define-private (get-n-at-block-asked-to-join (miner-to-vote principal)) 
(begin 
  (asserts! (is-some (get value (map-get? map-block-asked-to-join {address: miner-to-vote}))) err-not-asked-to-join)
  (at-block 
    (unwrap-panic 
      (get-block-info? id-header-hash 
        (unwrap-panic 
          (get value 
            (map-get? map-block-asked-to-join {address: miner-to-vote}))))) 
            (ok (var-get n)))))

;; LEAVING FLOW

(define-public (leave-pool)
(begin 
  (asserts! (check-is-miner-now tx-sender) err-not-in-miner-map)
  (asserts! (not (is-eq (var-get notifier) tx-sender)) err-currently-notifier)
  (let ((remove-result (unwrap-panic (remove-principal-miners-list tx-sender)))
        (new-k-percentage (/ (* (var-get k) u100) (- (var-get n) u2))))
    (some (var-set miners-list remove-result))
    (var-set n (- (var-get n) u1))
    (map-set map-is-miner {address: tx-sender} {value: false})
    (if (>= new-k-percentage (var-get k-critical)) 
      (some (update-threshold))
      none)
    (ok true))))

;; REMOVING FLOW

(define-public (propose-removal (miner-to-remove principal))
(begin 
  (asserts! (not (is-eq (var-get n) u1)) err-cant-remove-when-alone-in-pool)
  (asserts! (check-is-miner-now tx-sender) err-not-in-miner-map) 
  (asserts! (check-is-miner-now miner-to-remove) err-not-in-miner-map-miner-to-remove)
  (asserts! (not (check-is-proposed-for-removal-now miner-to-remove)) err-already-proposed-for-removal) 
  (map-set map-block-proposed-to-remove {address: miner-to-remove} {value: block-height})
  (map-set map-is-proposed-for-removal {address: miner-to-remove} {value: true})
  (var-set proposed-removal-list (unwrap! (as-max-len? (concat (var-get proposed-removal-list) (list miner-to-remove )) u300) err-list-length-exceeded))
  (ok true)))

(define-public (vote-positive-remove-request (miner-to-vote principal))
(begin
  (asserts! (not (is-eq tx-sender miner-to-vote)) err-cant-vote-himself)
  (asserts! (check-is-proposed-for-removal-now miner-to-vote) err-not-proposed-for-removal) ;; map_is_proposed_for_removal
  (asserts! (is-ok (get-k-at-block-proposed-removal miner-to-vote)) err-not-proposed-for-removal-k-missing)
    (asserts! (unwrap! (check-is-miner-when-requested-remove miner-to-vote) err-cant-unwrap-check-miner) err-no-vote-permission)
    (asserts! (has-voted-remove miner-to-vote) err-already-voted) ;; O(1)
    (map-set map-remove-request-voter 
      {miner-to-vote: miner-to-vote, voter: tx-sender} 
      {value: true})
    (if (is-some (get value (map-get? map-votes-accept-removal {address: miner-to-vote}))) 
      (map-set map-votes-accept-removal {address: miner-to-vote} {value: (+ (unwrap-panic (get value (map-get? map-votes-accept-removal  {address: miner-to-vote}))) u1)})
      (map-set map-votes-accept-removal {address: miner-to-vote} {value: u1}))
    (some
      (if (is-vote-accepted (unwrap-panic (get value (map-get? map-votes-accept-removal {address: miner-to-vote}))) (unwrap-panic (get-k-at-block-proposed-removal miner-to-vote)))
        (process-removal miner-to-vote)
        (ok false)))
    (ok true)))

(define-public (vote-negative-remove-request (miner-to-vote principal))
(begin
  (asserts! (not (is-eq tx-sender miner-to-vote)) err-cant-vote-himself)
  (asserts! (check-is-proposed-for-removal-now miner-to-vote) err-not-proposed-for-removal) ;; map_is_waiting
  (asserts! (is-ok (get-k-at-block-proposed-removal miner-to-vote)) err-not-proposed-for-removal-k-missing)
  (asserts! (unwrap! (check-is-miner-when-requested-remove miner-to-vote) err-cant-unwrap-check-miner) err-no-vote-permission)
  (asserts! (has-voted-remove miner-to-vote) err-already-voted) ;; O(1)
  (map-set map-remove-request-voter 
    {miner-to-vote: miner-to-vote, voter: tx-sender} 
    {value: true})
  (if (is-some (get value (map-get? map-votes-reject-removal {address: miner-to-vote}))) 
    (map-set map-votes-reject-removal {address: miner-to-vote} {value: (+ (unwrap-panic (get value (map-get? map-votes-reject-removal {address: miner-to-vote}))) u1)})
    (map-set map-votes-reject-removal {address: miner-to-vote} {value: u1}))
  (some
    (if (is-vote-rejected-remove (unwrap-panic (get value (map-get? map-votes-reject-removal {address: miner-to-vote}))) (unwrap-panic (get-k-at-block-proposed-removal miner-to-vote)) (unwrap-panic (get-n-at-block-proposed-removal miner-to-vote)))
      (reject-removal miner-to-vote)
      (ok false)))
  (ok true)))

(define-private (process-removal (miner principal))
(begin 
  (let ((remove-result (unwrap-panic (remove-principal-miners-list miner)))
        (new-k-percentage (/ (* (var-get k) u100) (- (var-get n) u2))))
    (some (var-set miners-list remove-result))
    (var-set miner-to-remove-votes-remove miner)
    (var-set n (- (var-get n) u1))
    (map-delete map-is-miner {address: miner})
    (map-set map-blacklist {address: miner} {value: true})
    (unwrap! (remove-principal-proposed-removal-list miner) err-list-length-exceeded)
    (clear-votes-map-remove-vote miner)
    (if (>= new-k-percentage (var-get k-critical)) 
      (update-threshold)
      false)
    (ok true))))

(define-private (reject-removal (miner principal))
(begin 
  (var-set miner-to-remove-votes-remove miner)
  (unwrap! (remove-principal-proposed-removal-list miner) err-list-length-exceeded)
  (clear-votes-map-remove-vote miner)
  (ok true)))

(define-private (has-voted-remove (miner principal)) 
(not (if (is-some (get value (map-get? map-remove-request-voter {miner-to-vote: miner, voter: tx-sender})))
          (unwrap-panic (get value (map-get? map-remove-request-voter {miner-to-vote: miner, voter: tx-sender})))
          false
  )))

(define-private (clear-votes-map-remove-vote (miner principal)) 
(begin 
  (map-delete map-votes-accept-removal {address: (var-get miner-to-remove-votes-remove)})
  (map-delete map-votes-reject-removal {address: (var-get miner-to-remove-votes-remove)})
  (map-delete map-block-proposed-to-remove {address: (var-get miner-to-remove-votes-remove)})
  (map-delete map-is-proposed-for-removal {address: (var-get miner-to-remove-votes-remove)})
  (map remove-map-record-remove-vote (var-get miners-list))))

(define-private (remove-map-record-remove-vote (miner principal))
(if (is-some (map-get? map-remove-request-voter {miner-to-vote: (var-get miner-to-remove-votes-remove), voter: miner}))
  (map-delete map-remove-request-voter {miner-to-vote: (var-get miner-to-remove-votes-remove), voter: miner})
  false))

(define-private (get-k-at-block-proposed-removal (miner-to-vote principal)) 
(begin 
  (asserts! (is-some (get value (map-get? map-block-proposed-to-remove {address: miner-to-vote}))) err-not-proposed-for-removal)
  (at-block 
    (unwrap-panic 
      (get-block-info? id-header-hash 
        (unwrap-panic 
          (get value 
            (map-get? map-block-proposed-to-remove {address: miner-to-vote}))))) 
            (ok (var-get k)))))

(define-private (get-n-at-block-proposed-removal (miner-to-vote principal)) 
(begin 
  (asserts! (is-some (get value (map-get? map-block-proposed-to-remove {address: miner-to-vote}))) err-not-proposed-for-removal)
  (at-block 
    (unwrap-panic 
      (get-block-info? id-header-hash 
        (unwrap-panic 
          (get value 
            (map-get? map-block-proposed-to-remove {address: miner-to-vote}))))) 
            (ok (var-get n)))))

;; UPDATE NOTIFIER

(define-public (start-vote-notifier) 
(begin 
  (asserts! (not (var-get notifier-vote-active)) err-vote-started-already)
  (var-set notifier-vote-start-block block-height)
  (var-set notifier-vote-end-block (+ (var-get notifier-vote-start-block) notifier-election-blocks-to-pass))
  (var-set notifier-vote-active true)
  (if (var-get notifier-previous-entries-removed) 
      (begin 
        (ok (var-set notifier-previous-entries-removed false))) 
      (end-vote-notifier))))

(define-public (end-vote-notifier) 
(begin 
  (asserts! (>= block-height (var-get notifier-vote-end-block)) err-voting-still-active)
  (get-max-votes-number-notifier)
  (if (> (var-get max-votes-notifier) (/ (var-get k) u2)) 
    (var-set notifier (var-get max-voted-proposed-notifier))
    false)
  (delete-all-notifier-entries)
  (var-set notifier-vote-active false)
  (ok true)))

(define-private (get-max-votes-number-notifier) 
(map compare-votes-number-notifier (var-get miners-list)))

(define-private (compare-votes-number-notifier (proposed-notifier principal)) 
(if (is-some (get votes-number (map-get? map-votes-notifier {voted-notifier: proposed-notifier})))
(if (> (unwrap-panic (get votes-number (map-get? map-votes-notifier {voted-notifier: proposed-notifier}))) (var-get max-votes-notifier)) 
  (begin 
    (var-set max-votes-notifier (unwrap-panic (get votes-number (map-get? map-votes-notifier {voted-notifier: proposed-notifier})))) 
    (var-set max-voted-proposed-notifier proposed-notifier))
  (if (is-eq (unwrap-panic (get votes-number (map-get? map-votes-notifier {voted-notifier: proposed-notifier}))) (var-get max-votes-notifier)) 
    (if 
      (< 
        (unwrap-panic (get block-height (map-get? map-block-joined {address: proposed-notifier}))) 
        (unwrap-panic (get block-height (map-get? map-block-joined {address: (var-get max-voted-proposed-notifier)})))) 
      (begin 
          (var-set max-voted-proposed-notifier proposed-notifier))
      false)
  false))
  false))

(define-private (delete-all-notifier-entries) 
(begin 
  (var-set max-votes-notifier u0)
  (var-set max-voted-proposed-notifier (var-get notifier))
  (map delete-one-notifier-entry (var-get miners-list))
  (var-set notifier-previous-entries-removed true)))

(define-private (delete-one-notifier-entry (miner principal)) 
(begin 
  (map-delete map-voted-update-notifier {miner-who-voted: miner})
  (map-delete map-votes-notifier {voted-notifier: miner})))

(define-public (vote-notifier (voted-notifier principal)) 
(begin 
  (asserts! (and (is-some (get value (map-get? map-is-miner {address: voted-notifier}))) (unwrap-panic (get value (map-get? map-is-miner {address: voted-notifier})))) err-not-in-miner-map)
  (asserts! (and (is-some (get value (map-get? map-is-miner {address: tx-sender}))) (unwrap-panic (get value (map-get? map-is-miner {address: tx-sender})))) err-no-vote-permission)
  (asserts! (var-get notifier-vote-active) err-not-voting-period)
  (asserts! (not (is-eq tx-sender voted-notifier)) err-cant-vote-himself)
  (asserts! (< block-height (var-get notifier-vote-end-block)) err-not-voting-period)
  (asserts! (is-none (get miner-voted (map-get? map-voted-update-notifier {miner-who-voted: tx-sender}))) err-already-voted)
  (map-set map-voted-update-notifier {miner-who-voted: tx-sender} {miner-voted: voted-notifier})
  (if (is-none (get votes-number (map-get? map-votes-notifier {voted-notifier: voted-notifier}))) 
    (map-set map-votes-notifier {voted-notifier: voted-notifier} {votes-number: u1}) 
    (map-set map-votes-notifier {voted-notifier: voted-notifier} {votes-number: (+ (unwrap-panic (get votes-number (map-get? map-votes-notifier {voted-notifier: voted-notifier}))) u1)}))
  (try! 
    (if (is-vote-accepted (+ (unwrap-panic (get votes-number (map-get? map-votes-notifier {voted-notifier: voted-notifier}))) u1) (var-get k)) 
    (begin 
      (var-set notifier voted-notifier)
      (var-set notifier-vote-end-block block-height)
      (var-set notifier-vote-active false)
      (end-vote-notifier))
    (ok false)))
(ok true)))
;; WARNING FLOW

(define-public (warn-miner (miner principal)) 
(begin 
(let ((incremented-value 
      (if 
        (is-some (get value (map-get? map-warnings {address: miner}))) 
        (+ (unwrap-panic (get value (map-get? map-warnings {address: miner}))) u1) 
        u1))) 
  (asserts! (is-eq tx-sender (var-get notifier)) err-only-notifier) 
  (asserts! 
    (not (and 
      (is-none (at-block (unwrap! (get-block-info? id-header-hash (- block-height u1)) err-cant-unwrap-block-info) (get value (map-get? map-warnings {address: miner}))))
      (>= incremented-value u2))) 
    err-one-warning-per-block)
  (asserts! 
    (not 
      (>= 
        (- 
          incremented-value
          (unwrap! (at-block (unwrap! (get-block-info? id-header-hash (- block-height u1)) err-cant-unwrap-block-info) (get value (map-get? map-warnings {address: miner}))) err-cant-unwrap-block-info)) 
        u2)) 
    err-one-warning-per-block)
    (ok 
      (if 
        (is-some (get value (map-get? map-warnings {address: miner}))) 
        (map-set map-warnings {address: miner} {value: (+ (unwrap-panic (get value (map-get? map-warnings {address: miner}))) u1)})
        (map-set map-warnings {address: miner} {value: u1}))))))

;; ELECTION FUNCTIONS

(define-private (is-vote-accepted (votes-number uint) (k-local uint))
(if 
  (is-eq k-local u0) ;; k is 0 for n=1, n=2 
    (>= votes-number u1) 
    (>= votes-number k-local)))

(define-private (is-democratic-vote-accepted-notifier (votes-number uint) (k-local uint))
(if 
  (is-eq k-local u0) ;; k is 0 for n=1, n=2 
    (>= votes-number u1) 
    (>= votes-number (/ k-local u2))))

(define-private (is-vote-rejected-join (votes-number uint) (k-local uint) (n-local uint))
(if 
  (is-eq n-local u1) 
  (>= votes-number u1) 
  (if (is-eq n-local u2) 
    (>= votes-number u2) 
    (>= votes-number (+ (- n-local k-local) u1)))))


(define-private (is-vote-rejected-remove (votes-number uint) (k-local uint) (n-local uint))
(if 
  (is-eq n-local u2) 
  (>= votes-number u1) 
  (if (is-eq n-local u3)
    (>= votes-number u2)
    (>= votes-number (+ (- n-local k-local) u1)))))

(define-private (is-vote-rejected-notifier (votes-number uint) (k-local uint) (n-local uint))
(if (is-eq n-local u2) 
  (>= votes-number u1) 
  (if (is-eq n-local u3)
    (>= votes-number u2)
    (>= votes-number (+ (- n-local k-local) u1)))))

;; LIST PROCESSING FUNCTIONS

(define-public (remove-principal-waiting-list (miner principal))
(begin
    (var-set waiting-list-miner-to-remove miner) 
    (ok (filter is-principal-in-waiting-list (var-get waiting-list))))) 

(define-public (remove-principal-pending-accept-list (miner principal))
(begin 
    (var-set waiting-list-miner-to-remove miner) 
    (ok (filter is-principal-in-pending-accept-list (var-get pending-accept-list)))))

(define-public (remove-principal-miners-list (miner principal))
(begin
  (var-set miners-list-miner-to-remove miner) 
  (ok (filter is-principal-in-miners-list (var-get miners-list)))))

(define-public (remove-principal-proposed-removal-list (miner principal))
(begin
  (var-set proposed-removal-list-miner-to-remove miner) 
  (ok (filter is-principal-in-proposed-removal-list (var-get proposed-removal-list)))))
;; MINER STATUS FUNCTIONS

(define-public (check-is-miner-when-requested-join (miner-to-vote principal))
(ok (if 
  (is-some 
    (at-block (unwrap! (get-block-info? id-header-hash 
      (unwrap! (get value (map-get? map-block-asked-to-join {address: miner-to-vote})) err-cant-unwrap-asked-to-join)) err-cant-unwrap-block-info) 
        (get value (map-get? map-is-miner {address: tx-sender}))))
  (at-block 
    (unwrap! 
      (get-block-info? id-header-hash 
        (unwrap-panic 
          (get value 
            (map-get? map-block-asked-to-join {address: miner-to-vote}))))
            (err u789))
            (unwrap-panic (get value (map-get? map-is-miner {address: tx-sender}))))
  false)))

(define-public (check-is-miner-when-requested-remove (miner-to-vote principal))
(ok (if 
  (is-some 
    (at-block (unwrap! (get-block-info? id-header-hash 
      (unwrap! (get value (map-get? map-block-proposed-to-remove {address: miner-to-vote})) err-cant-unwrap-asked-to-join)) err-cant-unwrap-block-info) 
        (get value (map-get? map-is-miner {address: tx-sender}))))
  (at-block 
    (unwrap! 
      (get-block-info? id-header-hash 
        (unwrap-panic 
          (get value 
            (map-get? map-block-proposed-to-remove {address: miner-to-vote}))))
            (err u795))
            (unwrap-panic (get value (map-get? map-is-miner {address: tx-sender}))))
  false)))

(define-read-only (check-is-miner-when-requested-join-tool-fn (miner-to-vote-address principal)) 
(get value (map-get? map-is-miner {address: tx-sender})))

(define-private (check-is-miner-now (miner principal))
(if (is-some (get value (map-get? map-is-miner {address: miner})))
  (unwrap-panic (get value (map-get? map-is-miner {address: miner})))
  false))

(define-private (check-is-proposed-for-removal-now (miner principal))
(if (is-some (get value (map-get? map-is-proposed-for-removal {address: miner})))
  (unwrap-panic (get value (map-get? map-is-proposed-for-removal {address: miner})))
  false))

(define-private (check-is-waiting-now (miner principal))
(if (is-some (get value (map-get? map-is-waiting {address: miner})))
  (unwrap-panic (get value (map-get? map-is-waiting {address: miner})))
  false))

(define-private (get-reward-at-block (block-number uint)) 
(begin 
  {reward: (get-block-info? block-reward block-number), 
  claimer: (get-block-info? miner-address block-number)}))

(define-read-only (get-reward-at-block-read (block-number uint)) 
(begin 
  {reward: (get-block-info? block-reward block-number), 
  claimer: (get-block-info? miner-address block-number)
  }))

;; READ-ONLY UTILS

;; (define-read-only (check-vote-accepted) ;; to check the vote status inside FE
;; (is-vote-accepted (unwrap-panic (get value (map-get? map-votes-accept-join {address: tx-sender})))))

(define-read-only (get-principals-list (address principal)) 
(map-get? add-lists-principal {address: tx-sender}))

(define-read-only (get-k) 
(var-get k))

(define-read-only (get-notifier) 
(var-get notifier))

(define-read-only (get-waiting-list) 
(var-get waiting-list))

(define-read-only (get-miners-list) 
(var-get miners-list))

(define-read-only (get-pending-accept-list) 
(var-get pending-accept-list ))

(define-read-only (get-proposed-removal-list) 
(var-get proposed-removal-list ))

(define-read-only (get-notifier-vote-status) 
(var-get notifier-vote-active))

(define-read-only (get-notifier-vote-number (voted-notifier principal)) 
(get votes-number (map-get? map-votes-notifier {voted-notifier: voted-notifier})))

(define-read-only (get-max-voted-notifier) 
(var-get max-voted-proposed-notifier))

(define-read-only (get-max-votes-notifier) 
(var-get max-votes-notifier))

(define-private (is-principal-in-waiting-list (miner principal))
(not (is-eq 
  (var-get waiting-list-miner-to-remove)
  miner)))

(define-private (is-principal-in-pending-accept-list (miner principal))
(not (is-eq 
  (var-get pending-accept-list-miner-to-remove)
  miner)))

(define-private (is-principal-in-miners-list (miner principal))
(not (is-eq  
  (var-get miners-list-miner-to-remove) 
  miner)))

(define-private (is-principal-in-proposed-removal-list (miner principal))
(not (is-eq  
  (var-get proposed-removal-list-miner-to-remove) 
  miner)))
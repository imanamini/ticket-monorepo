export enum ReserveStatus {
  /// <summary>
  /// The customer has not reserved yet
  /// </summary>
  Pending = 0,

  /// <summary>
  /// The customer has been reserved and the method has been selected,
  /// but the user of the operation has not yet performed an action,
  /// then customer can change it
  /// </summary>
  Reserved = 100,

  /// <summary>
  /// The customer has been reserved and the method has been selected,
  /// and the user of the operation has performed an action,
  /// then customer can not change it
  /// </summary>
  Locked = 200
}

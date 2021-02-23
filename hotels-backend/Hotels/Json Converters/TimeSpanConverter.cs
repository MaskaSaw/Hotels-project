using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;

namespace Hotels.JsonConverters
{
    public class TimeSpanConverter: JsonConverter<TimeSpan>
    {
        public override TimeSpan Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options
        )
        {
            string value = reader.GetString();
            TimeSpan interval;

            if (TimeSpan.TryParseExact(value, "h\\:mm",CultureInfo.InvariantCulture, TimeSpanStyles.AssumeNegative, out interval))
            {
                return interval;
            }
            else
            {
                throw new JsonException("Cannot convert given data to TimeSpan");
            }
        }

        public override void Write(
            Utf8JsonWriter writer,
            TimeSpan value,
            JsonSerializerOptions options
        )
        {
            writer.WriteStringValue(value.ToString("h\\:mm", CultureInfo.InvariantCulture));
        }
    }
}
